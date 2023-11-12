import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Button,
  ImageBackground,
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
    // <View style={styles.container}>
    <ImageBackground
      source={require("./assets/background.jpg")}
      resizeMode="cover"
      imageStyle={{ opacity: 0.6 }}
      width={500}
      height={500}
      style={styles.container}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#E67C31" />
      ) : (
        <>
          {image && <Image style={styles.image} source={{ uri: image }} />}
          <Text style={styles.quote}>{quote.quote}</Text>
          <Text style={styles.character}>{quote.character}</Text>
        </>
      )}
      <Button
        color={"#272226"}
        title="Gerar nova frase"
        onPress={fetchRandomQuote}
      />
      <Button color={"#272226"} title="Copiar" onPress={fetchRandomQuote} />
      <StatusBar style="auto" />
    </ImageBackground>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  character: {
    fontSize: 20,
    fontWeight: "bold",
  },
  quote: {
    fontSize: 17,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
});
