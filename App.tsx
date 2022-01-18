import axios from 'axios';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  TextInput,
  View,
  Button,
  Image,
} from 'react-native';

interface CoffeeArticle {
  label: string;
  imagePath: string;
};

const queryCoffeeImage = async (): Promise<string> => {
  try {
    const response = await axios.get("https://coffee.alexflipnote.dev/random.json");
    console.log(response.data.file)
    return response.data.file;
  } catch (err) {
    return ""
  }
}

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [coffeeArticles, setCoffeeArticles] = React.useState<Array<CoffeeArticle>>([]);
  const [inputText, setInputText] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const onButtonPressed = async () => {
    if (inputText === "") {
      setError("Make sure that the input is filled before publishing !");
      return;
    }
    
    const img = await queryCoffeeImage();

    if (img === "") {
      setError("Couldn't get image");
      return;
    }
    setCoffeeArticles([...coffeeArticles, {
      label: inputText,
      imagePath: img,
    }]);
    setInputText("");
    setError("");
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView 
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <TextInput
          style={styles.inputStyle}
          placeholder='Quoi de neuf ?'
          value={inputText}
          onChangeText={(text: string) => setInputText(text)}
        />
        <Button color="#fdce2a" title="Publier" onPress={onButtonPressed} />
        {error ? 
          <Text style={styles.errorStyle}>
            {error}
          </Text> : <></>
        }
        <View style={styles.coffeeScroll}>
          {coffeeArticles.map((article: CoffeeArticle) => {
            return (
              <>
                <View style={styles.articleStyle}>
                  <Text style={styles.textStyle}>
                    {article.label}
                  </Text>
                  <Image
                    style={styles.imageStyle}
                    source={{uri: article.imagePath}}
                  />
                </View>
              </>
            )  
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  articleStyle: {
    paddingTop: 15,
    flexDirection: 'column',
  },
  imageStyle: {
    width: 270,
    height: 200,
    padding: 4,
    justifyContent: 'center'
  },
  coffeeScroll: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorStyle: {
    color:'#b22222',
    fontSize: 15,
  },
  textStyle: {
    color: 'black',
    textAlign: 'left',
  },
  inputStyle: {
    padding: 10,
  },

});

export default App;
