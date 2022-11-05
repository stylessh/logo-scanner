declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_ENV: string;
    NEXT_PUBLIC_DEEPAI_API_KEY: string;
  }
}
interface IScan {
  id: string;
  output: {
    distance: number;
  };
}

interface IResult {
  id: number;
  name: string;
  url: string;
  output: {
    distance: number;
  };
}
