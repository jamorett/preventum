import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AppTest() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Minimal App Test</Text>
            <Text style={styles.text}>If you see this, the environment is fine.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
    },
});
