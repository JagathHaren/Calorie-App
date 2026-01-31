
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { View as ViewType } from '../types';

interface BottomNavProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const { width } = Dimensions.get('window');

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onViewChange }) => {
  const items = [
    { id: 'dashboard' as ViewType, label: 'CORE', path: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { id: 'recipes' as ViewType, label: 'FEED', path: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
    { id: 'camera' as ViewType, label: 'LENS', isCenter: true, path: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9zm12 4a3 3 0 11-6 0 3 3 0 016 0z" },
    { id: 'history' as ViewType, label: 'LOGS', path: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
    { id: 'water' as ViewType, label: 'AQUA', path: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" }
  ];

  return (
    <View style={styles.navContainer}>
      {items.map((item, i) => (
        item.isCenter ? (
          <TouchableOpacity 
            key={i} 
            onPress={() => onViewChange(item.id)} 
            style={styles.centerBtn}
          >
            <View style={styles.centerIcon}>
              <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <Path d={item.path} stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            key={i} 
            onPress={() => onViewChange(item.id)} 
            style={styles.navItem}
          >
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path 
                d={item.path} 
                stroke={activeView === item.id ? "#dc2626" : "rgba(69,10,10,0.2)"} 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </Svg>
            <Text style={[styles.navLabel, activeView === item.id && styles.navLabelActive]}>{item.label}</Text>
          </TouchableOpacity>
        )
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, backgroundColor: '#fff', borderTopWidth: 2, borderTopColor: '#fef2f2', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 20 },
  navItem: { alignItems: 'center', gap: 4 },
  navLabel: { fontSize: 8, fontWeight: '900', color: 'rgba(69,10,10,0.2)', letterSpacing: 1 },
  navLabelActive: { color: '#dc2626' },
  centerBtn: { marginTop: -60, shadowColor: '#dc2626', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 },
  centerIcon: { width: 72, height: 72, backgroundColor: '#dc2626', borderRadius: 24, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '45deg' }], borderWidth: 6, borderColor: '#fff' },
});

export default BottomNav;
