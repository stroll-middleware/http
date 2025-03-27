export * from './get';
export * from './get/DL';
export * from './get/streamText';
export * from './patch';
export * from './patch/fileForm';
export * from './patch/form';
export * from './post';
export * from './post/DL';
export * from './post/fileForm';
export * from './post/form';
export * from './put';
export * from './put/fileForm';
export * from './put/form';
export * from './connect';
export * from './delete';
export * from './head';
export * from './options';
export * from './trace';

import GET from './get';
import GETDL from './get/DL';
import GETSTREAMTEXT from './get/streamText';
import PATCH from './patch';
import PATCHFILEFORM from './patch/fileForm';
import PATCHFORM from './patch/form';
import POST from './post';
import POSTDL from './post/DL';
import POSTFILEFORM from './post/fileForm';
import POSTFORM from './post/form';
import PUT from './put';
import PUTFILEFORM from './put/fileForm';
import PUTFORM from './put/form';
import CONNECT from './connect';
import DELETE from './delete';
import HEAD from './head';
import OPTIONS from './options';
import TRACE from './trace';

export default {
  GET,
  GETDL,
  GETSTREAMTEXT,
  PATCH,
  PATCHFORM,
  PATCHFILEFORM,
  POST,
  POSTDL,
  POSTFILEFORM,
  POSTFORM,
  PUT,
  PUTFILEFORM,
  PUTFORM,
  CONNECT,
  DELETE,
  HEAD,
  OPTIONS,
  TRACE,
}