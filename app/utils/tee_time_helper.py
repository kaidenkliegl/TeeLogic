from datetime import datetime, timedelta

def tee_time_generator(settings, date):
    tee_times = []

    # Combine the given date with the start and end times from settings
    start_datetime = datetime.combine(date, settings.start_time.time())
    end_datetime = datetime.combine(date, settings.end_time.time())

    # Calculate total available minutes for tee times
    total_minutes = int((end_datetime - start_datetime).total_seconds() // 60)

    # Calculate how many tee times fit in the available window
    max_tee_times = total_minutes // settings.interval_minutes

    # Generate tee times spaced by interval_minutes until end time
    for i in range(max_tee_times):
        tee_time_start = start_datetime + timedelta(minutes=i * settings.interval_minutes)

        tee_time = {
            'start_time': tee_time_start,
            'course_id': settings.course_id,
            'interval': settings.interval_minutes,
            'max_players': 4,
            'available_spots': 4,
            'status': 'available'
        }
        tee_times.append(tee_time)

    return tee_times
