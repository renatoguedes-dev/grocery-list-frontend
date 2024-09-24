import {
    FC,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import style from "./inventoryModal.module.css";
import PageContext from "../../Contexts/PageContext";
import Inventories from "../../../In-memory-repository/Inventories";
import {
    clearErrorClasses,
    validateFields,
    validateNewItemAmount,
} from "../../../utils/inputFieldsVerification";

interface InventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNewItem: React.Dispatch<React.SetStateAction<boolean>>;
}

const InventoryModal: FC<InventoryModalProps> = ({
    isOpen,
    onClose,
    onNewItem,
}) => {
    const { loggedUser } = useContext(PageContext);

    const dialogRef = useRef<HTMLDialogElement | null>(null);

    // Error message refs
    const itemErrorRef = useRef<HTMLParagraphElement | null>(null);
    const currentAmountErrorRef = useRef<HTMLParagraphElement | null>(null);
    const minimumAmountErrorRef = useRef<HTMLParagraphElement | null>(null);

    const [formData, setFormData] = useState({
        item: "",
        currentAmount: 0,
        minimumAmount: 0,
    });

    const closeModal = useCallback(() => {
        setFormData({
            item: "",
            currentAmount: 0,
            minimumAmount: 0,
        });

        onClose();
    }, [onClose]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Clear all previous error classes
        clearErrorClasses(
            [itemErrorRef, currentAmountErrorRef, minimumAmountErrorRef],
            style.activateError
        );

        // Validate input fields
        const hasErrors = validateFields(
            [{ fieldType: "item", value: formData.item, ref: itemErrorRef }],
            style.activateError
        );

        const amountHasErrors = validateNewItemAmount(
            [
                {
                    value: formData.currentAmount,
                    ref: currentAmountErrorRef,
                },
                {
                    value: formData.minimumAmount,
                    ref: minimumAmountErrorRef,
                },
            ],
            style.activateError
        );

        // return early if there are errors.
        if (hasErrors || amountHasErrors) return null;

        if (loggedUser) {
            Inventories.addItem({
                userId: loggedUser.userId,
                itemName: formData.item,
                currentAmount: formData.currentAmount,
                minimumAmount: formData.minimumAmount,
            });
        }

        if (dialogRef.current) {
            dialogRef.current.close();
            onNewItem(true);
            closeModal();
        }
    };

    useEffect(() => {
        const dialog = dialogRef.current;

        // Open the modal when isOpen is true
        if (isOpen && dialog) {
            dialog.showModal();
        } else if (dialog) {
            dialog.close();
        }

        // Handle Escape key
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeModal();
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose, closeModal]);

    if (!isOpen) return null;

    return createPortal(
        <dialog ref={dialogRef} className={style.modal}>
            <h1 className={style.modalHeader}>Add a new item</h1>
            <form
                method="dialog"
                className={style.newItemForm}
                onSubmit={handleSubmit}
            >
                <div className={style.itemDiv}>
                    <div className={style.inputDivs}>
                        <label htmlFor="newItem">Item</label>
                        <input
                            id="newItem"
                            type="text"
                            name="item"
                            value={formData.item}
                            onChange={handleInputChange}
                            autoFocus
                        />
                    </div>

                    <p className={style.errorDiv} ref={itemErrorRef}>
                        This field cannot be empty *
                    </p>
                </div>

                <div className={style.currentAmountDiv}>
                    <div className={style.inputDivs}>
                        <label htmlFor="currentAmount">Current Amount</label>
                        <input
                            id="currentAmount"
                            type="number"
                            name="currentAmount"
                            value={formData.currentAmount}
                            onChange={handleInputChange}
                            min={0}
                        />
                    </div>

                    <p className={style.errorDiv} ref={currentAmountErrorRef}>
                        This field cannot be empty *
                    </p>
                </div>

                <div className={style.minimumAmountDiv}>
                    <div className={style.inputDivs}>
                        <label htmlFor="minimumAmount">Minimum Amount</label>
                        <input
                            id="minimumAmount"
                            type="number"
                            name="minimumAmount"
                            value={formData.minimumAmount}
                            onChange={handleInputChange}
                            min={0}
                        />
                    </div>

                    <p className={style.errorDiv} ref={minimumAmountErrorRef}>
                        This field cannot be empty *
                    </p>
                </div>

                <div className={style.buttonsDiv}>
                    <button type="submit">Add Item</button>
                    <button className={style.cancelBtn} onClick={closeModal}>
                        Cancel
                    </button>
                </div>
            </form>
        </dialog>,
        document.body
    );
};

export default InventoryModal;