import React, { useState, useEffect } from "react";
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
  const [quote, setQuote] = useState({
    anime: "",
    character: "",
    quote: "",
  });

  const [characterData, setCharacterData] = useState([]);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const getCharacterInfos = async (name: string) => {
    let character = {};
    await fetch(`https://narutodb.xyz/api/character/search?name=${name}`)
      .then((response) => response.json())
      .then((data) => {
        character = data;
        // setImage(data[0].images[0]);
      })
      .catch((error) => {
        console.log("Error:", error);
      });

    return character;
  };

  const getCharacter = async (name: string) => {
    const character = await getCharacterInfos(name);
    return character;
  };

  const fetchRandomQuote = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://animechan.xyz/api/random/anime?title=naruto"
      );
      const quote = await response.json();
      const character = await getCharacter(quote.character);
      if (character) {
        console.log(character);
        setLoading(false);
        setImage(character.images[0]);
      }
      setQuote(quote);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {image && (
            <Image
              style={{ width: 200, height: 200 }}
              source={{ uri: image }}
            />
          )}
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
