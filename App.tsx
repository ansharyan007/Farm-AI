import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RealScan from './screens/RealScan';

function Overview(){return <SafeAreaView style={styles.safe}><View style={styles.page}><Text style={styles.kicker}>FARM AI / FIELD INTELLIGENCE</Text><Text style={styles.title}>Your farm, understood.</Text><Text style={styles.body}>Upload a clear crop-leaf photo from the Scan tab to run the trained disease model.</Text><View style={styles.card}><Text style={styles.cardTitle}>Supported trained classes</Text><Text style={styles.cardText}>Tomato · Potato · Maize</Text><Text style={styles.cardText}>Rice, wheat, and cotton require additional trained field datasets.</Text></View><Text style={styles.note}>Predictions are decision support, not a definitive agronomic diagnosis.</Text></View></SafeAreaView>}
const Tab=createBottomTabNavigator();
export default function App(){return <SafeAreaProvider><NavigationContainer><Tab.Navigator screenOptions={{headerShown:false,tabBarActiveTintColor:'#1D6B4F'}}><Tab.Screen name="Overview" component={Overview} options={{tabBarIcon:()=> <Text>⌂</Text>}}/><Tab.Screen name="Scan" component={RealScan} options={{tabBarIcon:()=> <Text>◉</Text>}}/></Tab.Navigator></NavigationContainer></SafeAreaProvider>}
const styles=StyleSheet.create({safe:{flex:1,backgroundColor:'#F7F8F2'},page:{padding:24},kicker:{color:'#1D6B4F',fontSize:10,fontWeight:'800',letterSpacing:1.5,marginTop:20},title:{color:'#14352B',fontSize:30,fontWeight:'800',marginTop:10},body:{color:'#6B7F76',fontSize:16,lineHeight:24,marginTop:12},card:{backgroundColor:'#fff',borderRadius:18,padding:18,marginTop:28,borderWidth:1,borderColor:'#E5EAE3'},cardTitle:{color:'#14352B',fontSize:17,fontWeight:'800',marginBottom:10},cardText:{color:'#6B7F76',fontSize:14,lineHeight:22},note:{color:'#A56A09',fontSize:12,lineHeight:18,marginTop:22}});
