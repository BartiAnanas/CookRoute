import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { Button } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailsScreen() {
  const route = useRoute();
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    console.log(`Fetching recipe with ID: ${recipeId}`);
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        if (data.meals && data.meals[0]) {
          setRecipe(data.meals[0]);
          checkIfFavorite(data.meals[0].idMeal);
        } else {
          console.error('Recipe not found');
        }
      })
      .catch(error => console.error('Error fetching recipe:', error));
  }, [recipeId]);

  const checkIfFavorite = async (id) => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
     // console.log('Loaded favorites:', favorites);
      if (favorites) {
        const parsedFavorites = JSON.parse(favorites);
        setIsFavorite(parsedFavorites.some(item => item && item.idMeal === id));
      }
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      console.log('Toggling favorite');
      const favorites = await AsyncStorage.getItem('favorites');
      let parsedFavorites = favorites ? JSON.parse(favorites).filter(item => item !== null) : [];
     // console.log('Current favorites:', parsedFavorites);
      if (isFavorite) {
        parsedFavorites = parsedFavorites.filter(item => item.idMeal !== recipe.idMeal);
      //  console.log('Removing from favorites:', recipe.idMeal);
      } else {
        parsedFavorites.push(recipe);
      //  console.log('Adding to favorites:', recipe.idMeal);
      }
      await AsyncStorage.setItem('favorites', JSON.stringify(parsedFavorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (!recipe) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ImageBackground
        source={{ uri: recipe.strMealThumb }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <Text style={styles.title}>{recipe.strMeal}</Text>
          <Text style={styles.category}>{recipe.strCategory}</Text>
          <Text style={styles.instructions}>{recipe.strInstructions}</Text>
          <Button
            mode="contained"
            onPress={toggleFavorite}
            style={styles.button}
          >
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </Button>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  category: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#BB86FC',  
  },
});
