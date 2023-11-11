import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Button,
} from "react-native";

export default function App() {
  const [quote, setQuote] = React.useState({
    anime: "",
    character: "",
    quote: "",
  });

  const [characterData, setCharacterData] = React.useState([]);
  const [image, setImage] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const getCharacterInfos = () => {
    fetch("https://naruto-api-rsl3.onrender.com/api/v1/characters")
      .then((response) => response.json())
      .then((data) => {
        setCharacterData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error:", error);
        setLoading(false);
      });
  };

  const getCharacter = (name) => {
    getCharacterInfos();

    const character = characterData.find((char) => char.name === name);
    console.log(character);
    return character;
  };

  const fetchRandomQuote = () => {
    setLoading(true);
    fetch("https://animechan.xyz/api/random/anime?title=naruto")
      .then((response) => response.json())
      .then((quote) => {
        const character = getCharacter(quote.character);
        if (character) {
          setImage(character.images[0]);
        }
        setQuote(quote);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error:", error);
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {image && <Image source={{ uri: image }} />}
          <Text>{quote.quote}</Text>
          <Text>{quote.character}</Text>
        </>
      )}
      <Button title="Get Random Quote" onPress={fetchRandomQuote} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
