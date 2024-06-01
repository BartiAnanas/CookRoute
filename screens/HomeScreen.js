import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, ImageBackground, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

export default function HomeScreen({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, [index]);

  const fetchRecipes = () => {
    if (loading || !hasMore) return;

    setLoading(true);
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${alphabet[index]}`)
      .then(response => response.json())
      .then(data => {
        if (data.meals) {
          setRecipes(prevRecipes => {
            const newRecipes = [...prevRecipes, ...data.meals];
            return removeDuplicates(newRecipes);
          });
        }
        setLoading(false);
        if (index >= alphabet.length - 1) {
          setHasMore(false);
        }
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  };

  const removeDuplicates = (array) => {
    const uniqueIds = new Set();
    return array.filter(item => {
      if (uniqueIds.has(item.idMeal)) {
        return false;
      } else {
        uniqueIds.add(item.idMeal);
        return true;
      }
    });
  };

  const loadMore = () => {
    if (hasMore) {
      setIndex(prevIndex => prevIndex + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.idMeal.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardContent}>
              <TouchableOpacity onPress={() => navigation.navigate('RecipeDetails', { recipeId: item.idMeal })}>
                <ImageBackground source={{ uri: item.strMealThumb }} style={styles.backgroundImage}>
                  <View style={styles.overlay}>
                    <Card.Content style={styles.content}>
                      <Title style={styles.title}>{item.strMeal}</Title>
                      <Paragraph style={styles.paragraph}>{item.strCategory}</Paragraph>
                    </Card.Content>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </Card>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <ActivityIndicator size="large" color="#0000ff" />}
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
});
