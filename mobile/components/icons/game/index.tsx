import { cssInterop } from 'nativewind';
import Svg, { Path, Rect, Circle as SVGCircle } from 'react-native-svg';

interface IGenProps {
  color?: string;
  className?: string;
  style?: any;
}

interface ICircleProps extends IGenProps {
  size?: number;
}

interface ISquareProps extends IGenProps {
  size?: TSize;
}

interface IIconProps extends ISquareProps {}

type TSize = {
  w: number;
  h: number;
};

cssInterop(Svg, {
  className: 'style',
});

export function Circle({ size = 55, color = '#999999', className = '' }: ICircleProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 55 55"
      fill="none"
      className={className}
      // xmlns="http://www.w3.org/2000/svg"
    >
      <SVGCircle cx="27.5" cy="27.5" r="27.5" fill={color} />
    </Svg>
  );
}

export function Oval({ size = { w: 78, h: 40 }, color = '#FF9500', className = '' }: ISquareProps) {
  return (
    <Svg
      width={size.w}
      height={size.h}
      viewBox="0 0 78 40"
      fill="none"
      className={className}
      //xmlns="http://www.w3.org/2000/svg"
    >
      {/* <Rect width={size.w} height={size.h} rx="20" fill={color} /> */}
      <Rect width={'78'} height={'40'} rx="20" fill={color} />
    </Svg>
  );
}

export function Pattern({
  size = { w: 124, h: 12 },
  color = '#2FB8FF',
  className = '',
}: ISquareProps) {
  return (
    <Svg width={size.w} height={size.h} viewBox="0 0 124 12" fill="none" className={className}>
      <Rect x="36" width="16" height="12" rx="2" fill={color} />
      <Rect width="16" height="12" rx="2" fill={color} />
      <Rect x="72" width="16" height="12" rx="2" fill={color} />
      <Rect x="108" width="16" height="12" rx="2" fill={color} />
      <Rect x="57" y="1" width="10" height="10" rx="5" stroke={color} stroke-width="2" />
      <Rect x="21" y="1" width="10" height="10" rx="5" stroke={color} stroke-width="2" />
      <Rect x="93" y="1" width="10" height="10" rx="5" stroke={color} stroke-width="2" />
    </Svg>
  );
}

export function Square({
  size = { w: 16, h: 12 },
  color = '#2FB8FF',
  className = '',
}: ISquareProps) {
  return (
    <Svg
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w + 4} ${size.h + 4}`}
      fill="none"
      className={className}>
      <Rect y={1} x={1} width={size.w + 2} height={size.h + 2} rx={2} fill={color} />
    </Svg>
  );
}

export function CircleOutline({ size = 12, color = '#2FB8FF', className = '' }: ICircleProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${size + 4} ${size + 4}`}
      fill="none"
      className={className}>
      <Rect y={1} x={1} width={size + 2} height={size + 2} rx="10" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

export function ArrowLeft({
  size = { w: 23, h: 19 },
  color = '#ebebf58d',
  className = '',
  ...props
}: IIconProps) {
  return (
    <Svg
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w} ${size.h}`}
      fill="none"
      //xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}>
      <Path
        d="M0 9.22266C0 8.82422 0.175781 8.42578 0.457031 8.14453L8.13281 0.480469C8.46094 0.152344 8.82422 0 9.1875 0C10.0312 0 10.6172 0.597656 10.6172 1.39453C10.6172 1.81641 10.4414 2.16797 10.1719 2.4375L7.55859 5.08594L4.46484 7.91016L7.125 7.75781H20.9414C21.832 7.75781 22.4297 8.35547 22.4297 9.22266C22.4297 10.0898 21.832 10.6875 20.9414 10.6875H7.125L4.46484 10.5352L7.55859 13.3594L10.1719 16.0078C10.4414 16.2656 10.6172 16.6172 10.6172 17.0508C10.6172 17.8359 10.0312 18.4336 9.1875 18.4336C8.82422 18.4336 8.46094 18.293 8.15625 17.9883L0.457031 10.3008C0.175781 10.0195 0 9.62109 0 9.22266Z"
        fill={color}
      />
    </Svg>
  );
}
