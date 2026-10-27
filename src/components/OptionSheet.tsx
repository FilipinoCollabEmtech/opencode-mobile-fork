import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTranslation } from "react-i18next"

export interface OptionSheetOption<T extends string> {
  value: T
  label: string
  description?: string
}

interface Props<T extends string> {
  visible: boolean
  title: string
  options: readonly OptionSheetOption<T>[]
  value: T
  isDark: boolean
  onSelect: (value: T) => void
  onClose: () => void
}

// A small, dependency-free picker used where a native Alert would run out of
// buttons (Android's Alert.alert silently drops everything after the third
// button). Rows are full-width and readable, unlike a 3+ item action sheet.
export function OptionSheet<T extends string>({
  visible,
  title,
  options,
  value,
  isDark,
  onSelect,
  onClose,
}: Props<T>) {
  const { t } = useTranslation()

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View style={[s.card, isDark && s.cardDark]} accessibilityViewIsModal>
          <Text style={[s.title, isDark && s.textDark]}>{title}</Text>
          {options.map((option) => {
            const selected = option.value === value
            return (
              <TouchableOpacity
                key={option.value}
                style={[s.row, isDark && s.rowDark, selected && s.rowSelected, selected && isDark && s.rowSelectedDark]}
                onPress={() => {
                  onSelect(option.value)
                  onClose()
                }}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
              >
                <View style={s.rowText}>
                  <Text style={[s.label, isDark && s.textDark, selected && s.labelSelected]}>{option.label}</Text>
                  {option.description && (
                    <Text style={[s.description, isDark && s.metaDark]} numberOfLines={2}>
                      {option.description}
                    </Text>
                  )}
                </View>
                {selected && <Ionicons name="checkmark-circle" size={22} color="#8b5cf6" />}
              </TouchableOpacity>
            )
          })}
          <TouchableOpacity style={s.cancel} onPress={onClose} accessibilityRole="button">
            <Text style={[s.cancelText, isDark && s.metaDark]}>{t("common.cancel")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  cardDark: { backgroundColor: "#1a1a1a" },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0a0a0a",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
  },
  rowDark: { backgroundColor: "#242424" },
  rowSelected: { backgroundColor: "#f5f3ff" },
  rowSelectedDark: { backgroundColor: "#2a2040" },
  rowText: { flex: 1, gap: 2 },
  label: { fontSize: 15, fontWeight: "600", color: "#0a0a0a" },
  labelSelected: { color: "#6d28d9" },
  description: { fontSize: 12, color: "#666666" },
  textDark: { color: "#ffffff" },
  metaDark: { color: "#888888" },
  cancel: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  cancelText: { fontSize: 15, fontWeight: "600", color: "#666666" },
})
