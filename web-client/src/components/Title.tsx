type TitleProps = {
    text: string;
    size?: 'sm' | 'md' | 'lg';
  };
  
  export default function Title({ text, size = 'md' }: TitleProps) {
    const sizeClass = {
      sm: 'title-sm',
      md: 'title-md',
      lg: 'title-lg',
    }[size];
  
    return <h1 className={`title ${sizeClass}`}>{text}</h1>;
  }