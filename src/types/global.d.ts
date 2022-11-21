declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const styles: Record<string, string>;
  export default styles;
}

declare type Nullable<T> = T | null;

declare module 'react-day-picker/src/classNames' {
  import { ClassNames } from 'react-day-picker/types/ClassNames';

  const classNames: ClassNames;

  export default classNames;
}
