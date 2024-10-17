import { Text } from "react-native";

//Label component that is used when showing spending items' date and cost
export default function Label({ content, selfStyle }) {
  return (
    <>
      <Text style={[{ fontWeight: "bold", textAlign: "center" }, selfStyle]}>
        {content}
      </Text>
    </>
  );
}
