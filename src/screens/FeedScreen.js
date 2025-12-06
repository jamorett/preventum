import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, StatusBar, Platform } from 'react-native';
import { db } from '../config/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import COLORS from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function FeedScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = [];
      querySnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() });
      });
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.authorContainer}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{item.authorName ? item.authorName.charAt(0).toUpperCase() : 'U'}</Text>
          </View>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName} numberOfLines={1} ellipsizeMode="tail">
              {item.authorName || 'Usuario'}
            </Text>
            <Text style={styles.postDate}>
              {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'Reciente'}
            </Text>
          </View>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.gray} />
      </View>
      <Text style={styles.postContent}>{item.content}</Text>

      <View style={styles.postFooter}>
        <View style={styles.interactionButton}>
          <Ionicons name="heart-outline" size={22} color={COLORS.brandDeep} />
          <Text style={styles.interactionText}>Me gusta</Text>
        </View>
        <View style={styles.interactionButton}>
          <Ionicons name="chatbubble-outline" size={20} color={COLORS.brandDeep} />
          <Text style={styles.interactionText}>Comentar</Text>
        </View>
        <View style={styles.interactionButton}>
          <Ionicons name="share-social-outline" size={20} color={COLORS.brandDeep} />
          <Text style={styles.interactionText}>Compartir</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.brandPink} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.brandLight} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Comunidad</Text>
        <Text style={styles.headerSubtitle}>Comparte y apoya</Text>
      </View>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="newspaper-outline" size={48} color={COLORS.brandInactive} />
            <Text style={styles.emptyText}>No hay publicaciones aún.</Text>
            <Text style={styles.emptySubText}>¡Sé el primero en compartir algo!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brandLight,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.brandLight,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.brandDeep,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.6,
  },
  listContent: {
    padding: 20,
  },
  postCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.brandDeep,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.brandLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.brandPink,
  },
  avatarText: {
    color: COLORS.brandDeep,
    fontWeight: 'bold',
    fontSize: 16,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.text,
  },
  postDate: {
    color: COLORS.gray,
    fontSize: 12,
    marginTop: 2,
  },
  postContent: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 16,
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionText: {
    marginLeft: 6,
    fontSize: 13,
    color: COLORS.gray,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubText: {
    textAlign: 'center',
    color: COLORS.gray,
    fontSize: 14,
    marginTop: 8,
  },
});