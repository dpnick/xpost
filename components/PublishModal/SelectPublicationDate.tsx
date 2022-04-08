import Box from '@components/Box';
import Button from '@components/Button';
import StyledInput from '@components/StyledInput';
import Text from '@components/Text';
import styles from '@styles/Dashboard.module.scss';
import { addYears } from 'date-fns';
import React, { ChangeEvent, forwardRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import Divider from './Divider';

// const DatePicker = React.lazy(() => import('react-datepicker'));

const ButtonDocked = styled(Button)`
  width: 100%;
  position: sticky;
  bottom: 8px;
  border-radius: 4px;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  filter: hue-rotate(300deg) brightness(1.1);
`;

const StyledDatePicker = styled(StyledInput)`
  margin-bottom: 0;
  width: fit-content;
`;

// eslint-disable-next-line react/display-name
const CustomDatePicker = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ value, onClick, onChange, disabled }, ref) => (
  <StyledDatePicker
    ref={ref}
    type='text'
    value={value}
    disabled={disabled}
    onClick={onClick}
    onChange={onChange}
  />
));

interface SelectPublicationDateProps {
  next: () => void;
  setScheduledDate: (date: Date | null) => void;
}

export default function SelectPublicationDate({
  next,
  setScheduledDate,
}: SelectPublicationDateProps) {
  const [scheduled, setScheduled] = useState<boolean>(false);
  const [pickerValue, setPickerValue] = useState<Date | null | undefined>(
    new Date()
  );

  const filterPassedTime = (time: Date): boolean => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    return currentDate.getTime() < selectedDate.getTime();
  };

  const handleSchedule = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    if (!value) {
      setPickerValue(new Date());
    }
    setScheduledDate(value ? new Date() : null);
    setScheduled(event.target.checked);
  };

  const handleDateChange = (date: Date | null) => {
    const next: Date = Array.isArray(date) ? date[0] : date;
    if (next && scheduled) setScheduledDate(next);
    setPickerValue(next);
  };

  return (
    <Box
      width='100%'
      height='100%'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
    >
      <div>
        <Text fontSize='1.4em' fontWeight='bold' ml={2} mb={3}>
          When do you want to publish?
        </Text>
        <Divider />
      </div>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
      >
        <Text fontSize='1.2em' textAlign='center' color='gray.500'>
          By default your post will be published immediately but you could also
          schedule it for a later date.
        </Text>
        <Box
          width='100%'
          border='1px solid'
          borderColor='gray.300'
          backgroundColor='gray.100'
          borderRadius='8px'
          padding={4}
          mt={3}
        >
          <Box
            bg='gray.300'
            borderRadius='8px'
            p={2}
            width='fit-content'
            mx='auto'
            mb={3}
          >
            <Text color='gray.600'>beta feature</Text>
          </Box>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            mb={3}
          >
            <Checkbox
              name='isGoing'
              type='checkbox'
              checked={scheduled}
              onChange={handleSchedule}
            />
            <Text textAlign='center' ml={3}>
              Schedule for later
            </Text>
          </Box>
          <DatePicker
            disabled={!scheduled}
            selected={pickerValue}
            onChange={handleDateChange}
            showTimeSelect
            timeIntervals={60}
            filterTime={filterPassedTime}
            dateFormat='MMMM d, yyyy h:mm aa'
            minDate={new Date()}
            maxDate={addYears(new Date(), 1)}
            customInput={<CustomDatePicker />}
            wrapperClassName={styles.datePickerContainer}
          />
          <Text textAlign='center' color='gray.500' mt={2}>
            (will be published on your timezone)
          </Text>
        </Box>
      </Box>
      <ButtonDocked label='Next' onClick={next} />
    </Box>
  );
}
