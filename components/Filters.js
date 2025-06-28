import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const Filters = ({ onChange, selections, sections }) => {
  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <Pressable
          key={section}
          onPress={() => onChange(index)}
          style={[
            styles.filterButton,
            selections[index] ? styles.filterButtonSelected : null,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              selections[index] ? styles.filterTextSelected : null,
            ]}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    padding: 8,
    marginHorizontal: 4,
    backgroundColor: '#edefee',
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonSelected: {
    backgroundColor: '#495e57',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Karla-ExtraBold',
    color: '#495e57',
  },
  filterTextSelected: {
    color: '#fff',
  },
});

export default Filters;
