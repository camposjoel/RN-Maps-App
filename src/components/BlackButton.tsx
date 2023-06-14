import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native'

interface Props {
  title: string,
  onPress: () => void,
  style?: StyleProp<ViewStyle>
}

export const BlackButton = ({ title, onPress, style = {}}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        ...style as any,
        ...styles.blackButton
      }}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  blackButton: {
    height: 45,
    width: 200,
    backgroundColor: 'black',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18
  }
})