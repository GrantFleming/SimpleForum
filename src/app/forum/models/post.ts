export class Post {

  /* It is important that no default ID is given here. An id is assigned by the backend.
   Certain tests will fail if a default ID is added here as they check the validity of
   forms by testing the number of controls relative to the number of default properties
   of a fresh Post object */
  id: number;
  forumId: number;
  title = '';
  body = '';

}
