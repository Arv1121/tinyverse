import { useColorScheme } from 'react-native';
import { Colors } from '../constants/theme';

export type Theme = {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  isDark: boolean;
};

export function useTheme(): Theme {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return {
    isDark,
    background:    isDark ? Colors.slate900  : Colors.white,
    surface:       isDark ? '#1e293b'        : Colors.slate100,
    text:          isDark ? Colors.white     : Colors.navy,
    textSecondary: isDark ? Colors.slate400  : Colors.slate500,
    border:        isDark ? '#334155'        : Colors.slate200,
  };
}
