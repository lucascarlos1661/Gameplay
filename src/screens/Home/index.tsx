import React, { useState, useCallback } from "react"
import { View, FlatList } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation, useFocusEffect } from "@react-navigation/native"

import { Profile } from '../../components/Profile'
import { ButtonAdd } from "../../components/ButtonAdd"
import { CategorySelect } from "../../components/CategorySelect"
import { ListHeader } from "../../components/ListHeader"
import { Appointment, AppointmentProps } from "../../components/Appointment"
import { ListDivider } from "../../components/ListDivider"
import { styles } from './styles'
import { Background } from "../../components/Background"
import { Load } from "../../components/Load"
import { COLLECTION_APPOINTMENTS } from "../../configs/database"

export function Home() {

    const navigation = useNavigation()
    const [category, setCategory] = useState('')
    const [loading, setLoading] = useState(true)

    const [appointments, setApointments] = useState<AppointmentProps[]>([])

    function handleCategorySelect(categoryId: string) {
        categoryId === category ? setCategory('') : setCategory(categoryId)
    }

    function handleAppointmentDetails(guildSelected: AppointmentProps) {
        navigation.navigate('AppointmentDetails', { guildSelected })
    }

    function handleAppointmentCreate() {
        navigation.navigate('AppointmentCreate')
    }

    async function loadAppintments() {

        const response = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS)
        const storage: AppointmentProps[] = response ? JSON.parse(response) : []

        if (category) {
            setApointments(storage.filter(item => item.category === category))
        } else {
            setApointments(storage)
        }
        setLoading(false)
    }

    useFocusEffect(useCallback(() => {
        loadAppintments()
    }, [category]))

    return (
        <Background>
            <View style={styles.header}>
                <Profile />
                <ButtonAdd onPress={handleAppointmentCreate} />
            </View>

            <CategorySelect
                categorySelected={category}
                setCategory={handleCategorySelect}
            />

            {
                loading ?
                    <Load />
                    :
                    <>
                        <ListHeader
                            title='Partidas Agendadas'
                            subtitle={`Total ${appointments.length}`}
                        />

                        <FlatList
                            data={appointments}
                            keyExtractor={item => item.id}
                            style={styles.matches}
                            ItemSeparatorComponent={() => <ListDivider />}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 69 }}
                            renderItem={({ item }) => (
                                <Appointment
                                    data={item}
                                    onPress={() => handleAppointmentDetails(item)}
                                />
                            )}
                        />
                    </>
            }
        </Background>
    )
}