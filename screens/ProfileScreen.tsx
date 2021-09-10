import React from "react";
import { Touchable } from "../components/Touchable";
import { Text } from "react-native-ui-lib";
import { useTrans } from "../context/trans";
import { clearTokens } from "../util/auth";
import { RootTabScreenProps } from "../types";
import { saveCurrentUser } from "../hooks/useMe";
import { useAuth } from "../context/auth";
import { replace } from "../navigation/navigationRef";
import { useProfileQuery } from "../generated/graphql";
import Loading from "../components/Loading";
import { Error } from "../components/Error";
import { View } from "react-native";
import { KText } from "../components/KText";
import { Image } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/Ionicons";
import SelectModal from "../components/Select";

export const ProfileScreen = ({ navigation }: RootTabScreenProps<"Profile">) => {
  const { t, locale, setLocale } = useTrans();
  const { setIsAuthenticated } = useAuth();
  const [res, refetch] = useProfileQuery();

  console.log(res)

  if (res.error) {
    return (
      <Error
        onPress={() => {
          refetch();
        }}
        isError
        height={500}
        color={"#fff"}
        msg={t("حدث خطأ يرجى اعادة المحاولة")}
        btnText={t("اعد المحاولة")}
      />
    );
  }

  return (
    <>
      {!res.fetching ? (
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e5e5e5', padding: 20 }}>
          <Image
            source={{ uri: `http://localhost:9000/root/${res.data?.me.image}` }}
            width={60}
            height={60}
            style={{ backgroundColor: "#6A90CC", marginRight: 10 }}
            borderRadius={100}
          />
          <View>
            <KText style={{ color: "#000", textAlign: 'left' }}>{res.data?.me.name}</KText>
            <KText style={{ color: "#393939", textAlign: 'left' }}>{res.data?.me.school?.name} - {res.data?.me.stage?.name}</KText>
          </View>
        </View>
        <Touchable style={{ borderBottomWidth: 1, borderBottomColor: '#e5e5e5' }}>
          <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="ios-checkmark-done-circle-outline" size={22} color="#777" />
            <KText style={{ textAlign: 'left', color: '#000', paddingHorizontal: 20 }}>درجاتي</KText>
          </View>
        </Touchable>
        <Touchable style={{ borderBottomWidth: 1, borderBottomColor: '#e5e5e5' }}>
          <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="card-outline" size={22} color="#777" />
            <KText style={{ textAlign: 'left', color: '#000', paddingHorizontal: 20 }}>الاقساط المدفوعة</KText>
          </View>
        </Touchable>
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#e5e5e5' }}>
          <SelectModal
            data={[
              { name: 'العربية', value: 'ar' },
              { name: 'English', value: 'en' }
            ]}
            onSelect={({ value }) => {
              setLocale(value);
            }}
            selected={locale}
            renderBtn={() => (
              <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="ios-globe-outline" size={22} color="#777" />
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <KText style={{ textAlign: 'left', color: '#000', paddingHorizontal: 20 }}>اللغة</KText>
                  <KText style={{ textAlign: 'left', color: '#aaa', paddingHorizontal: 20 }}>{locale === 'ar'? 'العربية': 'English'}</KText>
                </View>
              </View>
            )}
            initialNumToRender={7}
            height={600}
          />
        </View>
        <Touchable
          onPress={async () => {
            await clearTokens();
            await saveCurrentUser(null);
            setIsAuthenticated(false);
            replace("Login");
          }}
          style={{ borderBottomWidth: 1, borderBottomColor: '#e5e5e5' }}
        >
          <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="log-out-outline" size={22} color="#777" />
            <KText style={{ textAlign: 'left', color: '#000', paddingHorizontal: 20 }}>تسجيل خروج</KText>
          </View>
        </Touchable>
      </View>
      ) : null}
      <Loading isLoading={res.fetching} height={500} color={"#fff"} />
    </>
  );
};
