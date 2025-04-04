import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAppDispatch } from '@/hooks/useAuthHooks';
import { router } from 'expo-router';
import { resetLoginData } from '@/contexts/reducers/authReducers';

const ProfileScreen = () => {
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(resetLoginData());
        router.push('/sign-in');
    };

    return (
        <View style={styles.container}>
            <View style={styles.accountPicture}>
                <FontAwesome6
                    name="circle-user"
                    size={150}
                    color="#1fddee"
                    solid
                />
            </View>
            <TouchableOpacity
                style={styles.profileOption}
                onPress={handleLogout}
            >
                <Text>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },

    accountPicture: {
        paddingVertical: 80,
    },

    profileOption: {
        backgroundColor: '#f9f9f9',
        width: '100%',
        padding: 24,
    },

    profileOptionText: {
        color: 'white',
    },
});
