declare module "aos" {
  interface AosOptions {
    once?: boolean;
    duration?: number;
    offset?: number;
    easing?: string;
    delay?: number;
    disable?: boolean | string | (() => boolean);
  }
  const AOS: {
    init(options?: AosOptions): void;
    refresh(initialize?: boolean): void;
  };
  export default AOS;
}
