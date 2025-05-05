import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScrollableLayout } from '@/components/ScrollableLayout';
import Header from '@/components/Header';

// Hard-coded data for an individual receipt
const receiptData = {
    id: 1,
    name: 'Alicia Keys',
    location: 'Olinda, Brazil',
    date: 'May 15, 2023',
    time: '14:30',
    items: [
        { name: 'Coffee', price: 5.99, deductible: true },
        { name: 'Sandwich', price: 8.50, deductible: true },
        { name: 'Notebook', price: 12.99, deductible: true },
        { name: 'Pen', price: 2.50, deductible: false },
        { name: 'Water', price: 1.99, deductible: false },
    ],
    subtotal: 31.97,
    tax: 2.88,
    total: 34.85
};

// Pre-calculated totals
const deductibleTotal = 27.48; // Coffee + Sandwich + Notebook
const nonDeductibleTotal = 4.49; // Pen + Water

const IndivAnalytics = () => {
    const params = useLocalSearchParams();
    const { id } = params;

    const screenWidth = Dimensions.get('window').width - 32; // Account for padding

    const chartConfig = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        color: (opacity = 1) => `rgba(76, 212, 226, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.7,
        useShadowColorFromDataset: false,
        decimalPlaces: 0,
    };

    // Data for itemized cost breakdown (bar chart)
    const itemizedData = {
        labels: ['Coffee', 'Sandwich', 'Notebook', 'Pen', 'Water'],
        datasets: [
            {
                data: [5.99, 8.50, 12.99, 2.50, 1.99],
            },
        ],
    };

    // Data for tax composition (pie chart)
    const taxData = [
        {
            name: 'Subtotal',
            population: 31.97,
            color: '#4CD4E2',
            legendFontColor: '#7F7F7F',
            legendFontSize: 12,
        },
        {
            name: 'Tax',
            population: 2.88,
            color: '#F5A623',
            legendFontColor: '#7F7F7F',
            legendFontSize: 12,
        },
    ];

    // Data for deductible vs non-deductible (pie chart)
    const deductibleData = [
        {
            name: 'Deductible',
            population: 27.48,
            color: '#4CD4E2',
            legendFontColor: '#7F7F7F',
            legendFontSize: 12,
        },
        {
            name: 'Non-Deductible',
            population: 4.49,
            color: '#FF6B6B',
            legendFontColor: '#7F7F7F',
            legendFontSize: 12,
        },
    ];

    return (
        <ScrollableLayout>

            <View style={styles.container}>
                <View style={styles.receiptHeader}>
                    <View style={styles.iconContainer}>
                        <FontAwesome6 name="receipt" size={24} color="#4CD4E2" />
                    </View>
                    <Text style={styles.title}>{receiptData.name}</Text>
                    <Text style={styles.subtitle}>{receiptData.location}</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.chartContainer}>
                        <BarChart
                            data={itemizedData}
                            width={screenWidth}
                            height={220}
                            chartConfig={chartConfig}
                            verticalLabelRotation={30}
                            fromZero
                            showValuesOnTopOfBars
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tax Composition</Text>
                    <Text style={styles.sectionSubtitle}>Visualizes how much of the receipt went to taxes vs. actual goods/services</Text>
                    <View style={styles.chartContainer}>
                        <PieChart
                            data={taxData}
                            width={screenWidth}
                            height={200}
                            chartConfig={chartConfig}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            absolute
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Deductible vs. Non-Deductible Items</Text>
                    <Text style={styles.sectionSubtitle}>Shows how much of the receipt contributes to a tax deduction</Text>
                    <View style={styles.chartContainer}>
                        <PieChart
                            data={deductibleData}
                            width={screenWidth}
                            height={200}
                            chartConfig={chartConfig}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            absolute
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Receipt Details</Text>
                    <View style={styles.detailsContainer}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Date & Time:</Text>
                            <Text style={styles.detailValue}>{receiptData.date} at {receiptData.time}</Text>
                        </View>

                        <Text style={styles.itemsHeader}>Items:</Text>
                        {receiptData.items.map((item, index) => (
                            <View key={index} style={styles.itemRow}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                                <View style={[styles.deductibleBadge, { backgroundColor: item.deductible ? '#4CD4E2' : '#FF6B6B' }]}>
                                    <Text style={styles.deductibleText}>{item.deductible ? 'Deductible' : 'Non-Deductible'}</Text>
                                </View>
                            </View>
                        ))}

                        <View style={styles.totalSection}>
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Subtotal:</Text>
                                <Text style={styles.totalValue}>${receiptData.subtotal.toFixed(2)}</Text>
                            </View>
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Tax:</Text>
                                <Text style={styles.totalValue}>${receiptData.tax.toFixed(2)}</Text>
                            </View>
                            <View style={[styles.totalRow, styles.finalTotal]}>
                                <Text style={styles.grandTotalLabel}>Total:</Text>
                                <Text style={styles.grandTotalValue}>${receiptData.total.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Analytics Summary</Text>
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryText}>
                            This receipt from <Text style={styles.bold}>Alicia Keys</Text> contains 5 items totaling $34.85.
                        </Text>
                        <Text style={styles.summaryText}>
                            Of this total, $2.88 (8.3%) was tax.
                        </Text>
                        <Text style={styles.summaryText}>
                            $27.48 (85.9%) of your purchase is tax-deductible.
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollableLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    receiptHeader: {
        alignItems: 'center',
        marginVertical: 16,
    },
    iconContainer: {
        backgroundColor: 'rgba(76, 212, 226, 0.2)',
        padding: 16,
        borderRadius: 50,
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    chartContainer: {
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 8,
    },
    detailsContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    detailLabel: {
        fontWeight: 'bold',
        width: 100,
    },
    detailValue: {
        flex: 1,
    },
    itemsHeader: {
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 8,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemName: {
        flex: 1,
    },
    itemPrice: {
        width: 70,
        textAlign: 'right',
    },
    deductibleBadge: {
        marginLeft: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    deductibleText: {
        color: 'white',
        fontSize: 10,
    },
    totalSection: {
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 16,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    totalLabel: {
        fontWeight: '500',
    },
    totalValue: {},
    finalTotal: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    grandTotalLabel: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    grandTotalValue: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    summaryContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
    },
    summaryText: {
        marginBottom: 8,
        lineHeight: 20,
    },
    bold: {
        fontWeight: 'bold',
    },
});

export default IndivAnalytics;