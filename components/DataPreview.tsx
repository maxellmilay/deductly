import { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Pressable,
    FlatList,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScrollableLayout } from './ScrollableLayout';
import Header from '@/components/Header';

interface Item {
    id: number;
    title: string;
    date: string;
}

interface DataPreviewProps {
    data: Item[];
    title: string;
    selectionTitle: string;
    onGenerateDocument?: () => void;
    generateButtonText?: string;
}

export const DataPreview = ({
    data,
    title,
    selectionTitle,
    onGenerateDocument,
    generateButtonText = 'Generate Tax Document',
}: DataPreviewProps) => {
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    const handleLongPress = (id: number) => {
        setIsSelectionMode(true);
        setSelectedItems([id]);
    };

    const handlePress = (id: number) => {
        if (isSelectionMode) {
            if (selectedItems.includes(id)) {
                const newSelected = selectedItems.filter((item) => item !== id);
                setSelectedItems(newSelected);
                if (newSelected.length === 0) {
                    setIsSelectionMode(false);
                }
            } else {
                setSelectedItems([...selectedItems, id]);
            }
        }
    };

    const handleDelete = () => {
        // Implement delete functionality here
        setSelectedItems([]);
        setIsSelectionMode(false);
    };

    const renderHeader = () => (
        <>
            <Header />
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl w-full text-center font-bold">
                    {isSelectionMode ? selectionTitle : title}
                </Text>
                {isSelectionMode && selectedItems.length > 0 && (
                    <TouchableOpacity
                        onPress={handleDelete}
                        className="flex-row items-center gap-2"
                    >
                        <FontAwesome6 name="trash" size={20} color="red" />
                    </TouchableOpacity>
                )}
            </View>
        </>
    );

    const renderItem = ({ item }: { item: Item }) => {
        const isSelected = selectedItems.includes(item.id);
        return (
            <Pressable
                onLongPress={() => handleLongPress(item.id)}
                onPress={() => handlePress(item.id)}
                className={`flex-row items-center pr-4 rounded-xl mb-2 ${
                    isSelected ? 'bg-gray-200' : 'bg-gray-50'
                }`}
            >
                <View className="w-24 h-24 bg-gray-200 rounded-lg rounded-r-none items-center justify-center mr-4">
                    <FontAwesome6 name="image" size={24} color="#A0A0A0" />
                </View>
                <View className="flex-1">
                    <Text className="text-base font-medium">{item.title}</Text>
                    <Text className="text-gray-500">{item.date}</Text>
                </View>
                {isSelectionMode && (
                    <View
                        className={`w-6 h-6 rounded-full border-2 ${
                            isSelected
                                ? 'bg-primary border-primary'
                                : 'border-gray-300'
                        } items-center justify-center`}
                    >
                        {isSelected && (
                            <FontAwesome6
                                name="check"
                                size={12}
                                color="white"
                            />
                        )}
                    </View>
                )}
            </Pressable>
        );
    };

    return (
        <ScrollableLayout>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
                ItemSeparatorComponent={() => <View className="h-2" />}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
            />
            {isSelectionMode && (
                <TouchableOpacity
                    onPress={onGenerateDocument}
                    className="bg-primary py-4 rounded-xl mt-4"
                >
                    <Text className="text-white text-center font-semibold">
                        {generateButtonText}
                    </Text>
                </TouchableOpacity>
            )}
        </ScrollableLayout>
    );
};
