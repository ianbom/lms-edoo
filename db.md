Enum user_role {
  admin
  student
}


Enum course_status {
  draft
  published
  archived
}

Enum content_type {
  video
  textbook
}

Enum enrollment_status {
  enrolled
  in_progress
  completed
}

Enum progress_status {
  not_started
  in_progress
  completed
}

Enum ebook_status {
  draft
  published
  archived
}

Table users {
  id bigint [pk, increment]

  name varchar(255) [not null]
  email varchar(255) [not null, unique]
  password varchar(255) [not null]

  role user_role [not null, default: 'student']

  email_verified_at timestamp
  remember_token varchar(100)
  last_login_at timestamp

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

  indexes {
    role
  }
}

Table course_categories {
  id bigint [pk, increment]

  name varchar(255) [not null]
  slug varchar(255) [not null, unique]

  description text

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

}

Table courses {
  id bigint [pk, increment]

  course_category_id bigint [not null]

  title varchar(255) [not null]
  slug varchar(255) [not null, unique]

  short_description varchar(500)
  description text

  thumbnail_url varchar(500)
  banner_url varchar(500)

  level varchar(100)
  estimated_duration_minutes int

  status course_status [not null, default: 'draft']

  created_by bigint

  published_at timestamp

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

  indexes {
    course_category_id
    status
    created_by
  }
}

Table teachers {
  id bigint [pk, increment]

  name varchar(255) [not null]
  photo_url varchar(500)

  expertise varchar(255)

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

  indexes {
    name
  }
}

Table course_teachers {
  id bigint [pk, increment]

  course_id bigint [not null]
  teacher_id bigint [not null]

  position int [not null, default: 0]

  created_at timestamp
  updated_at timestamp

  indexes {
    (course_id, teacher_id) [unique]
    course_id
    teacher_id
    position
  }
}

Table course_materials {
  id bigint [pk, increment]

  course_id bigint [not null]

  title varchar(255) [not null]
  description text

  position int [not null, default: 0]
  is_published boolean [not null, default: true]

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

  indexes {
    course_id
    position
    is_published
  }
}

Table learning_contents {
  id bigint [pk, increment]

  course_material_id bigint [not null]

  type content_type [not null]

  title varchar(255) [not null]
  description text

  position int [not null, default: 0]

  youtube_url varchar(500)
  youtube_video_id varchar(50)
  video_duration_seconds int

  textbook_content text

  attachment_url varchar(500)

  is_published boolean [not null, default: true]

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

  indexes {
    course_material_id
    type
    position
    is_published
    youtube_video_id
  }
}

Table course_enrollments {
  id bigint [pk, increment]

  user_id bigint [not null]
  course_id bigint [not null]

  status enrollment_status [not null, default: 'enrolled']

  progress_percentage decimal(5,2) [not null, default: 0]

  last_learning_content_id bigint

  enrolled_at timestamp
  started_at timestamp
  completed_at timestamp
  last_activity_at timestamp

  created_at timestamp
  updated_at timestamp

  indexes {
    (user_id, course_id) [unique]
    user_id
    course_id
    status
    completed_at
  }
}

Table learning_content_progress {
  id bigint [pk, increment]

  user_id bigint [not null]
  course_id bigint [not null]
  course_material_id bigint [not null]
  learning_content_id bigint [not null]

  status progress_status [not null, default: 'not_started']

  watched_seconds int [not null, default: 0]
  progress_percentage decimal(5,2) [not null, default: 0]

  first_viewed_at timestamp
  last_viewed_at timestamp
  completed_at timestamp

  created_at timestamp
  updated_at timestamp

  indexes {
    (user_id, learning_content_id) [unique]
    user_id
    course_id
    course_material_id
    learning_content_id
    status
  }
}

Table course_material_progress {
  id bigint [pk, increment]

  user_id bigint [not null]
  course_id bigint [not null]
  course_material_id bigint [not null]

  status progress_status [not null, default: 'not_started']

  total_contents int [not null, default: 0]
  completed_contents int [not null, default: 0]

  progress_percentage decimal(5,2) [not null, default: 0]

  started_at timestamp
  completed_at timestamp
  last_activity_at timestamp

  created_at timestamp
  updated_at timestamp

  indexes {
    (user_id, course_material_id) [unique]
    user_id
    course_id
    course_material_id
    status
  }
}

Table ebook_categories {
  id bigint [pk, increment]

  name varchar(255) [not null]
  slug varchar(255) [not null, unique]

  description text

  icon varchar(255)
  thumbnail_url varchar(500)

  is_active boolean [not null, default: true]
  position int [not null, default: 0]

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

  indexes {
    is_active
    position
  }
}

Table ebooks {
  id bigint [pk, increment]

  ebook_category_id bigint [not null]

  title varchar(255) [not null]
  slug varchar(255) [not null, unique]

  author varchar(255)

  short_description varchar(500)
  description text

  cover_url varchar(500)
  file_url varchar(500)

  file_name varchar(255)
  file_type varchar(100)
  file_size bigint

  total_pages int

  status ebook_status [not null, default: 'draft']

  created_by bigint

  published_at timestamp

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

  indexes {
    ebook_category_id
    status
    created_by
  }
}




/*
|--------------------------------------------------------------------------
| RELATIONS
|--------------------------------------------------------------------------
*/

Ref: courses.course_category_id > course_categories.id
Ref: courses.created_by > users.id

Ref: course_teachers.course_id > courses.id
Ref: course_teachers.teacher_id > teachers.id

Ref: course_materials.course_id > courses.id

Ref: learning_contents.course_material_id > course_materials.id

Ref: course_enrollments.user_id > users.id
Ref: course_enrollments.course_id > courses.id
Ref: course_enrollments.last_learning_content_id > learning_contents.id

Ref: learning_content_progress.user_id > users.id
Ref: learning_content_progress.course_id > courses.id
Ref: learning_content_progress.course_material_id > course_materials.id
Ref: learning_content_progress.learning_content_id > learning_contents.id

Ref: course_material_progress.user_id > users.id
Ref: course_material_progress.course_id > courses.id
Ref: course_material_progress.course_material_id > course_materials.id

Ref: ebooks.ebook_category_id > ebook_categories.id
Ref: ebooks.created_by > users.id