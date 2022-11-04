interface MatchesSubimageOptions {
  threshold?: number;
}

declare module "matches-subimage" {
  export default function matchesSubimage(
    image: any,
    subimage: any,
    options: MatchesSubimageOptions
  ): boolean;
}
