import Header from '@/components/Header';
import { FontAwesome6, FontAwesome } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

const TabsLayout = () => {
    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarStyle: {
                        height: 64,
                        paddingTop: 4,
                        display: 'flex',
                        paddingHorizontal: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    headerShown: false,
                    tabBarActiveTintColor: '#FFFFFF',
                    tabBarInactiveTintColor: '#B8E8EE',
                    tabBarBackground: () => (
                        <View className=" bg-primary h-full shadow-md" />
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
                                size={16}
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
                                size={16}
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
                            <TouchableOpacity
                                onPress={() =>
                                    router.push('/(protected)/(camera)/camera')
                                }
                                className="size-24 border-2 border-[#B8E8EE] bg-primary rounded-full mb-16 items-center justify-center"
                            >
                                <FontAwesome
                                    name="camera"
                                    size={24}
                                    color="#B8E8EE"
                                />
                            </TouchableOpacity>
                        ),
                    }}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                            router.push('/(protected)/(camera)/camera');
                        },
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
                                size={16}
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
                                size={16}
                                color={color}
                            />
                        ),
                        header: () => <Header />,
                    }}
                />
                <Tabs.Screen name="home" options={{ href: null }} />
            </Tabs>
        </>
    );
};

export default TabsLayout;
