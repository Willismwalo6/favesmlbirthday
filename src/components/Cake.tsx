type Props = {
  lit: boolean;
  blown?: boolean;
  className?: string;
  candles?: number;
};

export default function Cake({ lit, blown = false, className = '', candles = 5 }: Props) {
  return (
    <div className={`cake ${lit ? 'is-lit' : 'is-out'} ${blown ? 'is-blown' : ''} ${className}`} aria-hidden="true">
      <div className="cake__candles">
        {Array.from({ length: candles }, (_, index) => (
          <span
            key={index}
            className="cake__candle"
            style={{ ['--i' as string]: index }}
          >
            <span className="cake__wick" />
            {lit && <span className="cake__flame" />}
            {blown && <span className="cake__smoke" style={{ animationDelay: `${index * 0.14}s` }} />}
          </span>
        ))}
      </div>
      <div className="cake__tier cake__tier--top">
        <span className="cake__frosting" />
        <span className="cake__pearls" />
      </div>
      <div className="cake__tier cake__tier--mid">
        <span className="cake__frosting" />
        <span className="cake__sprinkles" />
      </div>
      <div className="cake__tier cake__tier--bottom">
        <span className="cake__frosting" />
      </div>
      <div className="cake__plate" />
      <span className="cake__rose cake__rose--one" />
      <span className="cake__rose cake__rose--two" />
    </div>
  );
}
