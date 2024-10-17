import ItemForm from "../../components/item/ItemForm";

//Edit Screen that allows user to edit related information for a spending record
export default function Edit({ route }) {
  return <ItemForm item={route.params} />;
}
