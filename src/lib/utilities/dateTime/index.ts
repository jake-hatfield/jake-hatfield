import { DateTime } from 'luxon';

// lib
import { pluralize } from '$lib/utilities/stringHelpers';

export const convertTimestampToDateTime = (timestamp: number) => {
	return DateTime.fromSeconds(timestamp);
};

export const getCurrentTime = () => {
	return DateTime.now();
};

export const getDifference = (futureDate: DateTime, date: DateTime) => {
	return futureDate.diff(date, ['days', 'hours', 'minutes']);
};

export const formatDifference = (futureDate: DateTime, date?: DateTime) => {
	let dt: DateTime;

	if (!date) {
		dt = getCurrentTime();
	} else {
		dt = date;
	}

	const difference = getDifference(futureDate, dt);

	// if only minutes left
	if (+difference.hours.toFixed(0) === 0 && difference.minutes < 60) {
		return `${pluralize(+difference.minutes.toFixed(0), 'minute')} left`;
	}

	// if more than 1 hour, but less than 1 day left
	if (difference.days < 1) {
		return `${pluralize(+difference.hours.toFixed(0), 'hour')} ${pluralize(
			+difference.minutes.toFixed(0),
			'minute'
		)} left`;
	}

	if (difference.days < 2) {
		return `${pluralize(+difference.hours.toFixed(0), 'hour')} left`;
	}

	return `${pluralize(+difference.days.toFixed(0), 'day')} left`;
};

export const formatTimestamp = (timestamp: number, showYear = false) => {
	const dt = convertTimestampToDateTime(timestamp);
	if (showYear) {
		return dt.toFormat('LLL dd, yyyy');
	} else {
		return dt.toFormat('LLL dd');
	}
};

export const formatIsoToText = (isoTimestamp: string) => {
	return DateTime.fromISO(isoTimestamp).toFormat('LLL dd @ t');
};
