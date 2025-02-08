import Header from '@/components/Header';
import { FontAwesome6, FontAwesome } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';

const TabsLayout = () => {
    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarStyle: {
                        height: 84,
                        paddingTop: 10,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    headerShown: false,
                    tabBarActiveTintColor: '#4CD4E2',
                    tabBarInactiveTintColor: '#6C757D',
                    tabBarBackground: () => (
                        <View className="bg-gray-100 border-t-[1px] border-gray-200 h-full" />
                    ),
                    tabBarIconStyle: {
                        marginTop: 0,
                    },
                }}
            >
                <Tabs.Screen
                    name="gallery"
                    options={{
                        title: 'Gallery',
                        headerShown: false,
                        tabBarLabel: 'Gallery',
                        tabBarIcon: ({ color, focused }) => (
                            <FontAwesome
                                name={focused ? 'image' : 'image'}
                                size={24}
                                color={color}
                            />
                        ),
                        header: () => <Header />,
                    }}
                />
                <Tabs.Screen
                    name="receipts"
                    options={{
                        title: 'Receipts',
                        headerShown: false,
                        tabBarLabel: 'Receipts',
                        tabBarIcon: ({ color, focused }) => (
                            <FontAwesome6
                                name={focused ? 'envelope' : 'envelope'}
                                size={24}
                                color={color}
                            />
                        ),
                        header: () => <Header />,
                    }}
                />
                <Tabs.Screen
                    name="camera"
                    options={{
                        title: 'Camera',
                        headerShown: false,
                        tabBarLabel: '',
                        tabBarIcon: () => (
                            <View className="size-24 border-2 border-gray-200 bg-primary rounded-full mb-16 items-center justify-center">
                                <FontAwesome
                                    name="camera"
                                    size={28}
                                    color="white"
                                />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="documents"
                    options={{
                        title: 'Documents',
                        headerShown: false,
                        tabBarLabel: 'Documents',
                        tabBarIcon: ({ color, focused }) => (
                            <FontAwesome6
                                name={focused ? 'folder' : 'folder'}
                                size={24}
                                color={color}
                            />
                        ),
                        header: () => <Header />,
                    }}
                />
                <Tabs.Screen
                    name="reports"
                    options={{
                        title: 'Reports',
                        headerShown: false,
                        tabBarLabel: 'Reports',
                        tabBarIcon: ({ color, focused }) => (
                            <FontAwesome6
                                name={focused ? 'chart-line' : 'chart-line'}
                                size={24}
                                color={color}
                            />
                        ),
                        header: () => <Header />,
                    }}
                />
                <Tabs.Screen name="home" options={{ href: null }} />
            </Tabs>
            <TouchableOpacity
                onPress={() => router.push('/chatbot')}
                className="z-50"
            >
                <View className="absolute bottom-32 right-4">
                    <Image
                        source={require('@/assets/images/chatbot.gif')}
                        style={{
                            width: 60,
                            height: 60,
                        }}
                        contentFit="contain"
                    />
                </View>
            </TouchableOpacity>
        </>
    );
};

export default TabsLayout;
