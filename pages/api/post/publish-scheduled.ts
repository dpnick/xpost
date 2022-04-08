import { decrypt } from '@lib/encrypt';
import { handlePrismaError, prisma } from '@lib/prisma';
import providers from '@lib/providers';
import { SelectOption } from '@models/selectOption';
import { Prisma } from '@prisma/client';
import { withSentry } from '@sentry/nextjs';
import { addMinutes, endOfHour, startOfHour } from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const key = req.headers.authorization?.split(' ')[1];
    if (key && key === process.env.SCHEDULED_KEY) {
      // event are dispatched at 55 to avoid high load times
      const time = Date.parse(addMinutes(new Date(), 5).toISOString());
      // check if there is any post not published yet scheduled for the current hour
      const scheduledPosts = await prisma.post.findMany({
        where: {
          scheduledAt: {
            gte: startOfHour(time),
            lte: endOfHour(time),
          },
          published: false,
        },
        include: {
          publications: {
            include: {
              integration: {
                include: {
                  provider: true,
                },
              },
            },
          },
        },
      });

      if (scheduledPosts?.length > 0) {
        // publish post on platform
        const promises = scheduledPosts.flatMap((post) => {
          const canonicalUrl = post.publications.find(
            (publication) => publication.isCanonical
          )?.url;
          return post.publications?.map(({ id, integration }) => {
            integration.token = decrypt(
              integration.token,
              process.env.NEXT_PUBLIC_INTEGRATION_SECRET!
            );
            // regex to find empty line containing only a backslash
            // check: https://github.com/outline/rich-markdown-editor/issues/532
            const stripRegEx = new RegExp(/^\\\W*$/gm);
            if (post.content && stripRegEx.test(post.content)) {
              post.content = post.content.replace(stripRegEx, '');
            }

            const tags = post.rawTags
              ? (post.rawTags as Prisma.JsonArray).map(
                  (tag) => JSON.parse(tag as string) as SelectOption
                )
              : [];
            return providers[integration.provider.name]
              .publishNewArticle(post, tags, integration, canonicalUrl)
              .then(async ({ url, publishedAt }) => {
                await prisma.publication.update({
                  where: {
                    id,
                  },
                  data: {
                    url,
                    publishedAt,
                    post: {
                      update: {
                        firstPublishedAt: new Date(),
                        published: true,
                      },
                    },
                  },
                });
              });
          });
        });

        await Promise.all(promises);
        // TODO: send notif / email to concerned users
      }

      return res.status(200).json({ success: true });
    }
    return res.status(401).json({ message: 'Missing permission' });
  } catch (error) {
    let message = String(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      message = handlePrismaError(error);
    } else if (error instanceof Error) {
      message = error.message;
    }
    return res
      .status(500)
      .json({ statusCode: 500, message: message ?? 'An error occured' });
  }
};

export default withSentry(handler);
