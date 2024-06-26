/** 
  Author: Piera Blum
  Date: 26.06.2024
  Description: This the Frontend for the Weather Page.
*/

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import logo from '../../assets/weather.png';
import pattern from '../../assets/pattern.png';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await fetch('http://10.80.4.173:3000/weather');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setWeatherData(data);
            } catch (error) {
                setError('Failed to fetch weather data');
            }
        };

        fetchWeatherData();
    }, []);

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }

    if (!weatherData) {
        return <Text style={styles.loading}>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
          <Image source={pattern} style={styles.patternbg} />
          <View style={styles.header}>
            <Image source={logo} style={styles.logo} />
          </View>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>{weatherData.cityName}</Text>
            {weatherData.daily.map((day, index) => (
              <View key={index} style={styles.dayContainer}>
                <Text style={styles.date}>{day.date}</Text>
                <Text style={styles.temperature}>Temperature: {day.temperature} °C</Text>
                <Text style={styles.rainProbability}>Rain Probability: {day.rainProbability * 100} %</Text>
                <Text style={styles.cloudiness}>Cloudiness: {day.cloudiness} %</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      );
    };
    
    export default Weather;
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        position: 'relative',
        paddingTop: 50,
      },
      patternbg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: windowWidth,
        height: windowHeight,
        zIndex: -1,
      },
      header: {
        position: 'absolute',
        top: 20,
        left: 20,
      },
      logo: {
        width: 150,
        height: 70,
        resizeMode: 'contain',
      },
      scrollContainer: {
        alignItems: 'center',
      },
      title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
        color: '#000',
      },
      dayContainer: {
        marginBottom: 16,
        alignItems: 'center',
        backgroundColor: '#FFB0CC',
        padding: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '90%',
      },
      date: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
      },
      temperature: {
        fontSize: 16,
        marginBottom: 4,
      },
      rainProbability: {
        fontSize: 16,
        marginBottom: 4,
      },
      cloudiness: {
        fontSize: 16,
        marginBottom: 4,
      },
      error: {
        color: 'red',
        textAlign: 'center',
      },
      loading: {
        textAlign: 'center',
      },
    });