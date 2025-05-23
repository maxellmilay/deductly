import {
    Text,
    View,
    Button,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { CAMERA_FACE_DIRECTION } from '@/constants/Camera';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState, useRef } from 'react';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import GoBackRoute from '@/components/GoBackRoute';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// Define receipt target frame dimensions
const RECEIPT_WIDTH = SCREEN_WIDTH * 0.9;
const RECEIPT_HEIGHT = SCREEN_HEIGHT * 0.7;

const CameraScreen = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [lastImage, setLastImage] = useState('');
    const [isCropping, setIsCropping] = useState(false);
    const cameraRef = useRef<any | null>(null);

    // Keep the camera view dimensions for accurate cropping
    const [cameraViewDimensions, setCameraViewDimensions] = useState({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    });

    // Function to get the last image
    const getLastImage = async () => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted') {
                const { assets } = await MediaLibrary.getAssetsAsync({
                    first: 1,
                    mediaType: 'photo',
                    sortBy: ['creationTime'],
                });

                if (assets.length > 0) {
                    setLastImage(assets[0].uri);
                }
            }
        } catch (error) {
            console.error('Failed to get last image:', error);
        }
    };

    useEffect(() => {
        getLastImage();
    }, []);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    // Calculate crop coordinates based on the receipt frame dimensions
    const calculateCropArea = (photoWidth: number, photoHeight: number) => {
        const viewWidth = cameraViewDimensions.width;
        const viewHeight = cameraViewDimensions.height;

        // Calculate aspect ratios
        const photoAspectRatio = photoWidth / photoHeight;
        const viewAspectRatio = viewWidth / viewHeight;

        // Calculate scale factor to fit the photo within the view while maintaining aspect ratio
        let scale = 1;
        if (photoAspectRatio > viewAspectRatio) {
            // Photo is wider than view
            scale = viewHeight / photoHeight;
        } else {
            // Photo is taller than view
            scale = viewWidth / photoWidth;
        }

        // Calculate scaled photo dimensions
        const scaledPhotoWidth = photoWidth * scale;
        const scaledPhotoHeight = photoHeight * scale;

        // Calculate position of frame relative to scaled photo
        const frameX = (scaledPhotoWidth - RECEIPT_WIDTH) / 2;
        const frameY = (scaledPhotoHeight - RECEIPT_HEIGHT) / 2;

        // Convert frame coordinates back to original photo scale
        const originX = Math.max(0, frameX / scale);
        const originY = Math.max(0, frameY / scale);
        const width = Math.min(
            photoWidth - originX,
            (RECEIPT_WIDTH / scale) * 1.3
        );
        const height = Math.min(
            photoHeight - originY,
            (RECEIPT_HEIGHT / scale) * 1.5
        );
        return { originX, originY, width, height };
    };

    // Function to process and save image
    const processAndSaveImage = async (photo: {
        uri: string;
        width: number;
        height: number;
    }, isFromGallery: boolean = false) => {
        setIsCropping(true);
        try {
            const { width, height, uri } = photo;

            // Create receipts directory if it doesn't exist
            const receiptsDir = `${FileSystem.documentDirectory}receipts/`;
            const dirInfo = await FileSystem.getInfoAsync(receiptsDir);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(receiptsDir, {
                    intermediates: true,
                });
            }

            // Generate filename and path
            const filename = `receipt_${Date.now()}.jpg`;
            const newUri = `${receiptsDir}${filename}`;

            if (isFromGallery) {
                // For gallery images, just copy the file without cropping
                await FileSystem.copyAsync({
                    from: uri,
                    to: newUri,
                });
            } else {
                // For camera images, apply cropping
                const cropArea = calculateCropArea(width, height);
                const validCropArea = {
                    originX: Math.max(0, Math.round(cropArea.originX)),
                    originY: Math.max(0, Math.round(cropArea.originY)),
                    width: Math.min(
                        width - cropArea.originX,
                        Math.round(cropArea.width)
                    ),
                    height: Math.min(
                        height - cropArea.originY,
                        Math.round(cropArea.height)
                    ),
                };

                // Crop and save in one operation
                const croppedImage = await ImageManipulator.manipulateAsync(
                    uri,
                    [
                        {
                            crop: validCropArea,
                        },
                    ],
                    {
                        compress: 0.8,
                        format: ImageManipulator.SaveFormat.JPEG,
                        base64: false,
                    }
                );

                // Save the cropped image
                await FileSystem.copyAsync({
                    from: croppedImage.uri,
                    to: newUri,
                });
            }

            return newUri;
        } catch (error) {
            console.error('Failed to process image:', error);
            // Fallback to use the original photo
            const receiptsDir = `${FileSystem.documentDirectory}receipts/`;
            const filename = `receipt_${Date.now()}.jpg`;
            const newUri = `${receiptsDir}${filename}`;
            await FileSystem.copyAsync({
                from: photo.uri,
                to: newUri,
            });
            return newUri;
        } finally {
            setIsCropping(false);
        }
    };

    const capture = async () => {
        if (cameraRef.current && !isCropping) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: true,
                    exif: true,
                    skipProcessing: false,
                });

                if (photo && photo.uri) {
                    const processedUri = await processAndSaveImage(photo, false);
                    router.back();
                    router.push(`/camera-modal?pictureUri=${processedUri}`);
                }
            } catch (error) {
                console.error('Failed to take picture:', error);
            }
        }
    };

    // Add gallery picker function
    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                base64: true,
                exif: true,
                allowsEditing: false,
            });

            if (!result.canceled && result.assets[0]) {
                const processedUri = await processAndSaveImage(
                    result.assets[0],
                    true // Mark as gallery image
                );
                router.push(`/camera-modal?pictureUri=${processedUri}`);
            }
        } catch (error) {
            console.error('Failed to pick image:', error);
        }
    };

    // Handle camera view layout changes to get accurate dimensions
    const handleCameraViewLayout = (event: any) => {
        const { width, height } = event.nativeEvent.layout;
        setCameraViewDimensions({ width, height });
    };

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={CAMERA_FACE_DIRECTION}
                onLayout={handleCameraViewLayout}
            >
                <GoBackRoute />

                {/* Receipt target frame */}
                <View style={styles.receiptFrameContainer}>
                    <View style={styles.receiptFrame}>
                        {/* Corner guides */}
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                    <Text style={styles.receiptInstructions}>
                        Align receipt within the frame
                    </Text>
                </View>

                {/* Bottom controls container */}
                <View style={styles.controlsContainer}>
                    <TouchableOpacity
                        onPress={pickImage}
                        style={styles.galleryButton}
                        disabled={isCropping}
                    >
                        {lastImage ? (
                            <Image
                                source={{ uri: lastImage }}
                                style={styles.lastImage}
                            />
                        ) : (
                            <FontAwesome name="image" size={24} color="white" />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={capture}
                        style={[
                            styles.captureButton,
                            isCropping && styles.disabledButton,
                        ]}
                        disabled={isCropping}
                    >
                        {isCropping ? (
                            <MaterialIcons
                                name="hourglass-top"
                                size={30}
                                color="white"
                            />
                        ) : (
                            <FontAwesome
                                name="camera"
                                size={30}
                                color="white"
                            />
                        )}
                    </TouchableOpacity>

                    {/* Empty View for spacing balance */}
                    <View style={styles.spacer} />
                </View>
            </CameraView>
        </View>
    );
};

export default CameraScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        color: 'white',
    },
    camera: {
        flex: 1,
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 100,
    },
    spacer: {
        width: 40,
    },
    lastImage: {
        width: '100%',
        height: '100%',
    },
    captureButton: {
        padding: 24,
        backgroundColor: '#1fddee',
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    disabledButton: {
        backgroundColor: '#6C757D',
    },
    galleryButton: {
        backgroundColor: '#6C757D',
        width: 40,
        height: 40,
        borderWidth: 2,
        borderColor: '#1fddee',
        borderRadius: 4,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    receiptFrameContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    receiptFrame: {
        width: RECEIPT_WIDTH,
        height: RECEIPT_HEIGHT,
        borderWidth: 2,
        borderColor: 'rgba(31, 221, 238, 0.7)',
        borderRadius: 10,
        position: 'relative',
    },
    receiptInstructions: {
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    corner: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderColor: '#1fddee',
        borderWidth: 3,
    },
    topLeft: {
        top: -2,
        left: -2,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopLeftRadius: 10,
    },
    topRight: {
        top: -2,
        right: -2,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderTopRightRadius: 10,
    },
    bottomLeft: {
        bottom: -2,
        left: -2,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomLeftRadius: 10,
    },
    bottomRight: {
        bottom: -2,
        right: -2,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomRightRadius: 10,
    },
});
