import { BlurView } from 'expo-blur';
import { GlassView } from 'expo-glass-effect';
import { cssInterop } from 'nativewind';

cssInterop(GlassView, {
  className: 'style',
});
cssInterop(BlurView, {
  className: 'style',
});

// Компонент для скляного фону
export const GlassBackground = ({ style, animatedIndex }: any) => {
  return (
    <BlurView
      intensity={50} // Рівень розмиття
      tint={'systemUltraThinMaterialLight'} // Можна змінити на 'dark' або 'extraLight'
      // style={[style, { borderRadius: 25, overflow: 'hidden' }]}
			style={style}
			className="overflow-hidden rounded"
    />
    // <GlassView
    // 	 glassEffectStyle="clear"
    //   style={style}
    //   className="overflow-hidden rounded"
    // />
  );
};
