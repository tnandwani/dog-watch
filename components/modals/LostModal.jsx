import React, {  } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Center,
  Modal,
} from 'native-base';

import { updateShowLostModal } from "../../redux/slices/interfaceSlice";
import LostList from "../widgets/LostList";

export default function LostModal(props) {

  const dispatch = useDispatch()
  const myZone = useSelector((state) => state.explore.myZone)
  let showLostModal = useSelector((state) => state.interface.modals.showLostModal);

  return (
    <Modal isOpen={showLostModal} onClose={() => dispatch(updateShowLostModal(false))}>
      <Modal.Content maxWidth="500px">
        <Modal.CloseButton />
        <Modal.Header colorScheme='emerald.500'>Lost Dogs</Modal.Header>
        <Modal.Body>
          {(myZone.lost.length > 0) &&
            <LostList />
          }
          {(myZone.lost.length < 1) &&
            <Center>No Lost Dogs!</Center>
          }


        </Modal.Body>

      </Modal.Content>

    </Modal>
  );
}
