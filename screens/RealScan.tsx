import React, {useEffect, useState} from 'react';
import {Alert, AppState, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Asset, launchCamera, launchImageLibrary} from 'react-native-image-picker';

const API_URL = 'http://10.0.2.2:8000';
const pretty = (value: string) => value.replace(/^(Tomato|Potato|Corn_\(maize\))___/, '').replaceAll('_', ' ').replace(/\s+/g, ' ').replace(/\b\w/g, x => x.toUpperCase());

export default function RealScan() {
  const [photo, setPhoto] = useState<Asset>();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>();
  useEffect(() => { const sub = AppState.addEventListener('change', state => { if (state === 'active') { setPhoto(undefined); setResult(undefined); } }); return () => sub.remove(); }, []);

  async function predict(asset?: Asset) {
    if (!asset?.uri) return;
    setPhoto(asset); setResult(undefined); setBusy(true);
    try {
      const body = new FormData();
      body.append('image', {uri: asset.uri, type: asset.type || 'image/jpeg', name: asset.fileName || 'leaf.jpg'} as any);
      body.append('crop', 'auto');
      const response = await fetch(`${API_URL}/predict`, {method: 'POST', body});
      if (!response.ok) throw new Error(await response.text());
      setResult(await response.json());
    } catch {
      Alert.alert('Could not analyze photo', 'Make sure the Farm AI API is running on port 8000 and the emulator can reach it.');
    } finally { setBusy(false); }
  }
  async function takePhoto() { const response = await launchCamera({mediaType: 'photo', cameraType: 'back', quality: 0.8}); if (!response.didCancel) predict(response.assets?.[0]); }
  async function choosePhoto() { const response = await launchImageLibrary({mediaType: 'photo', selectionLimit: 1, quality: 0.8}); if (!response.didCancel) predict(response.assets?.[0]); }

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
    <Text style={styles.kicker}>FARM AI / REAL INFERENCE</Text><Text style={styles.title}>Plant doctor</Text><Text style={styles.subtitle}>Upload a clear leaf photo. Farm AI detects the crop from the image.</Text>
    <View style={styles.frame}>{photo?.uri ? <Image source={{uri: photo.uri}} resizeMode="cover" style={styles.photo}/> : <><Text style={styles.camera}>📷</Text><Text style={styles.hint}>Your leaf photo appears here</Text></>}</View>
    {busy && <Text style={styles.status}>Running the trained CNN…</Text>}
    {result && photo?.uri && <View style={styles.result}><Text style={styles.resultLabel}>{result.uncertain ? 'NEEDS REVIEW' : 'MODEL RESULT'}</Text><Text style={styles.resultTitle}>{result.uncertain ? 'Uncertain prediction' : pretty(result.prediction)}</Text><Text style={styles.detected}>Detected crop: {result.detected_crop ? result.detected_crop[0].toUpperCase() + result.detected_crop.slice(1) : 'Unknown'}</Text><Text style={styles.confidence}>{Math.round(result.confidence * 100)}% confidence</Text><Text style={styles.disclaimer}>{result.disclaimer}</Text></View>}
    <TouchableOpacity style={styles.primary} onPress={takePhoto} disabled={busy}><Text style={styles.primaryText}>{busy ? 'Analyzing…' : 'Take photo'}</Text></TouchableOpacity><TouchableOpacity onPress={choosePhoto} disabled={busy}><Text style={styles.secondary}>Choose from gallery</Text></TouchableOpacity>{photo?.uri && <TouchableOpacity onPress={() => {setPhoto(undefined);setResult(undefined)}}><Text style={styles.clear}>Clear scan</Text></TouchableOpacity>}
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({safe:{flex:1,backgroundColor:'#F7F8F2'},page:{padding:24,paddingBottom:40},kicker:{color:'#1D6B4F',fontSize:10,fontWeight:'800',letterSpacing:1.5,marginTop:14},title:{color:'#14352B',fontSize:30,fontWeight:'800',marginTop:8},subtitle:{color:'#6B7F76',fontSize:15,marginTop:6},frame:{height:280,marginTop:20,borderRadius:24,backgroundColor:'#E7EEE5',justifyContent:'center',alignItems:'center',overflow:'hidden'},photo:{width:'100%',height:'100%'},camera:{fontSize:48},hint:{color:'#6B7F76',marginTop:10},status:{color:'#1D6B4F',fontWeight:'700',textAlign:'center',marginTop:14},result:{backgroundColor:'#fff',borderRadius:20,padding:18,marginTop:18,borderWidth:1,borderColor:'#E5EAE3'},resultLabel:{color:'#1D6B4F',fontSize:10,fontWeight:'900',letterSpacing:1.3},resultTitle:{color:'#14352B',fontSize:21,fontWeight:'800',marginTop:8},detected:{color:'#6B7F76',fontSize:14,fontWeight:'700',marginTop:6},confidence:{color:'#1D6B4F',fontSize:16,fontWeight:'800',marginTop:6},disclaimer:{color:'#6B7F76',fontSize:12,lineHeight:18,marginTop:10},primary:{backgroundColor:'#1D6B4F',borderRadius:15,padding:17,alignItems:'center',marginTop:22},primaryText:{color:'#fff',fontWeight:'800',fontSize:15},secondary:{color:'#1D6B4F',fontWeight:'800',textAlign:'center',padding:16},clear:{color:'#B13B2E',fontWeight:'800',textAlign:'center',padding:10}});
