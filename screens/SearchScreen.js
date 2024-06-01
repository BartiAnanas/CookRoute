import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TextInput, ImageBackground } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);

  const searchRecipes = () => {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
      .then(response => response.json())
      .then(data => setRecipes(data.meals))
      .catch(error => console.error(error));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Search for recipes"
          placeholderTextColor="#B0BEC5"
          value={query}
          onChangeText={setQuery}
        />
        <Button
          mode="contained"
          onPress={searchRecipes}
          style={styles.button}
        >
          Search
        </Button>
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.idMeal.toString()}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.cardContent}>
                <ImageBackground source={{ uri: item.strMealThumb }} style={styles.backgroundImage}>
                  <View style={styles.overlay}>
                    <Card.Content style={styles.content}>
                      <Title style={styles.title}>{item.strMeal}</Title>
                      <Paragraph style={styles.paragraph}>{item.strCategory}</Paragraph>
                    </Card.Content>
                    <Card.Actions>
                      <Button
                        mode="contained"
                        onPress={() => navigation.navigate('RecipeDetails', { recipeId: item.idMeal })}
                        style={styles.button}
                      >
                         Details
                      </Button>
                    </Card.Actions>
                  </View>
                </ImageBackground>
              </View>
            </Card>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',  
  },
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#ffffff',  
    backgroundColor: '#333333',  
  },
  card: {
    marginBottom: 10,
  },
  cardContent: {
    overflow: 'hidden',  
    borderRadius: 8,  
  },
  backgroundImage: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',  
    justifyContent: 'center',
  },
  content: {
    padding: 10,
  },
  title: {
    color: '#ffffff',  
  },
  paragraph: {
    color: '#B0BEC5',  
  },
  button: {
    backgroundColor: '#BB86FC',  
    marginLeft: 5,  
  },
});
