import { Text, View, ScrollView, TouchableOpacity, Pressable, TextInput, FlatList, SectionList, SafeAreaView } from 'react-native';
import { withThemeClasses } from './withThemeClasses';

// Create themed versions of components using the HOC
export const Themed = {
  Text: withThemeClasses(Text),
  View: withThemeClasses(View),
  ScrollView: withThemeClasses(ScrollView),
  TouchableOpacity: withThemeClasses(TouchableOpacity),
  Pressable: withThemeClasses(Pressable),
  TextInput: withThemeClasses(TextInput),
  FlatList: withThemeClasses(FlatList),
  SectionList: withThemeClasses(SectionList),
  SafeAreaView: withThemeClasses(SafeAreaView),
};
