import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ImageBackground } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem('favorites');
      console.log('Loaded favorites:', favoritesJson);
      if (favoritesJson) {
        setFavorites(JSON.parse(favoritesJson).filter(item => item !== null));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const removeFavorite = async (id) => {
    try {
      const newFavorites = favorites.filter(fav => fav.idMeal !== id);
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favorites}
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
                  <Card.Actions style={styles.actions}>
                    <Button
                      mode="contained"
                      onPress={() => navigation.navigate('RecipeDetails', { recipeId: item.idMeal })}
                      style={styles.button}
                    >
                      Details
                    </Button>
                    <Button
                      mode="contained"
                      onPress={() => removeFavorite(item.idMeal)}
                      style={styles.button}
                    >
                      Remove
                    </Button>
                  </Card.Actions>
                </View>
              </ImageBackground>
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#000000',  
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',  
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,  
    backgroundColor: '#BB86FC',  
  },
});
