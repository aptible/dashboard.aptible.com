export default function sum(enumerable){
  let initialValue = 0;
  return enumerable.reduce(
    (prev, cur) => prev + cur,
    initialValue
  );
}

