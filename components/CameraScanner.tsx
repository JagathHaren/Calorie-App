
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { analyzeFoodImage } from '../services/geminiService';
import { NutritionData, FoodLog, UserPreferences } from '../types';

interface CameraScannerProps {
  onLogAdded: (log: FoodLog) => void;
  onBack: () => void;
  prefs: UserPreferences;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onLogAdded, onBack, prefs }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<NutritionData | null>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) return <View style={styles.full} />;
  
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>NEURAL CAMERA ACCESS REQUIRED</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>ENABLE SENSORS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>ABORT</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync({ base64: true });
      if (photoData) {
        setPhoto(photoData.uri);
        setIsAnalyzing(true);
        try {
          const result = await analyzeFoodImage(photoData.base64 || "");
          setAnalysisResult(result);
        } catch (e) {
          Alert.alert("Scan Error", "AI system failed to parse image.");
        } finally {
          setIsAnalyzing(false);
        }
      }
    }
  };

  const confirmLog = () => {
    if (analysisResult) {
      onLogAdded({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        data: analysisResult,
        imageUrl: photo || undefined,
        type: 'photo'
      });
    }
  };

  return (
    <View style={styles.full}>
      {!photo ? (
        <CameraView style={styles.camera} facing="back" ref={cameraRef}>
          <View style={styles.overlay}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
                <Text style={styles.whiteIcon}>←</Text>
              </TouchableOpacity>
              <Text style={styles.title}>VISUAL SCAN</Text>
              <View style={{ width: 44 }} />
            </View>
            <View style={styles.reticle} />
            <TouchableOpacity style={styles.shutter} onPress={takePicture}>
              <View style={styles.shutterInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <View style={styles.full}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <View style={styles.resultSheet}>
            {isAnalyzing ? (
              <View style={styles.loading}>
                <ActivityIndicator size="large" color="#DC2626" />
                <Text style={styles.loadText}>NEURAL SCANNING...</Text>
              </View>
            ) : analysisResult ? (
              <View style={styles.resultContent}>
                <Text style={styles.foodName}>{analysisResult.name}</Text>
                <Text style={styles.foodCals}>{analysisResult.calories} KCAL</Text>
                <TouchableOpacity style={styles.commitBtn} onPress={confirmLog}>
                  <Text style={styles.commitText}>COMMIT TO LOG</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.redoBtn} onPress={() => {setPhoto(null); setAnalysisResult(null);}}>
                  <Text style={styles.redoText}>RE-SCAN</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  full: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', padding: 20 },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  header: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginTop: 40 },
  iconBtn: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 12, borderRadius: 12 },
  whiteIcon: { color: '#fff', fontSize: 24, fontWeight: '900' },
  title: { color: '#fff', fontWeight: '900', fontStyle: 'italic', letterSpacing: 2 },
  reticle: { width: 200, height: 200, borderWidth: 2, borderColor: 'rgba(220,38,38,0.5)', borderRadius: 40 },
  shutter: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', padding: 4, marginBottom: 40 },
  shutterInner: { flex: 1, borderRadius: 36, backgroundColor: '#DC2626' },
  permissionText: { color: '#fff', fontWeight: '900', marginBottom: 20, letterSpacing: 1 },
  btn: { backgroundColor: '#DC2626', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16 },
  btnText: { color: '#fff', fontWeight: '900' },
  backBtn: { marginTop: 20 },
  backText: { color: '#f87171', fontWeight: '900' },
  preview: { width: '100%', height: '50%' },
  resultSheet: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -40, padding: 32 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadText: { marginTop: 12, color: '#450a0a', fontWeight: '900', fontSize: 12 },
  resultContent: { flex: 1 },
  foodName: { fontSize: 32, fontWeight: '900', fontStyle: 'italic', color: '#450a0a' },
  foodCals: { fontSize: 40, fontWeight: '900', color: '#DC2626', marginVertical: 10 },
  commitBtn: { backgroundColor: '#DC2626', padding: 20, borderRadius: 20, marginTop: 20, alignItems: 'center' },
  commitText: { color: '#fff', fontWeight: '900', letterSpacing: 1 },
  redoBtn: { marginTop: 16, alignItems: 'center' },
  redoText: { color: '#991b1b', fontWeight: '900', fontSize: 12 },
});

export default CameraScanner;
