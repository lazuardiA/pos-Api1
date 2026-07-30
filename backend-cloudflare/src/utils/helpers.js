export const newId = () => crypto.randomUUID();

// Buang password_hash sebelum data user dikirim ke client
export const toSafeUser = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    email: row.email,
    phone: row.phone,
    role: row.role,
    membershipType: row.membership_type,
    isActive: !!row.is_active,
    createdAt: row.created_at,
  };
};

export const toClassObject = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    name: row.name,
    category: row.category,
    trainer: row.trainer,
    description: row.description,
    day: row.day,
    startTime: row.start_time,
    endTime: row.end_time,
    capacity: row.capacity,
    room: row.room,
    isActive: !!row.is_active,
    createdAt: row.created_at,
  };
};

export const toBookingObject = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    status: row.status,
    bookingDate: row.booking_date,
    notes: row.notes,
    createdAt: row.created_at,
    gymClass: row.class_id
      ? {
          _id: row.class_id,
          name: row.class_name,
          category: row.class_category,
          trainer: row.class_trainer,
          day: row.class_day,
          startTime: row.class_start_time,
          endTime: row.class_end_time,
          room: row.class_room,
          capacity: row.class_capacity,
        }
      : null,
    user: row.user_id
      ? {
          id: row.user_id,
          name: row.user_name,
          username: row.user_username,
          email: row.user_email,
        }
      : undefined,
  };
};
