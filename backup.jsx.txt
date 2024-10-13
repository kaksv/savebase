import React, { useContext, useState } from 'react';
import InputBox from '../../Components/Fields/InputBox';
import "./AccountPage.scss";
// import "./SubscriptionPage.scss";
import { AppContext } from '../Account';
import { NavBar } from '../../Components/navigation/NavBar';
import { UI_CONTEXTS } from '../../functionsAndConstants/Contexts';
import DataField from '../../Components/Fields/DataField';
import Grid from '@mui/material/Unstable_Grid2';
import { copyText } from '../../functionsAndConstants/walletFunctions/CopyWalletAddress';
import { shortenHexString } from '../../functionsAndConstants/Utils';
import { CANISTER_DATA_FIELDS } from '../../functionsAndConstants/Constants';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ModalComponent from '../../Components/modal/Modal';
import ButtonField from '../../Components/Fields/Button';
import ShowDisclaimer from '../../Components/modal/ShowDisclaimer';
import AccordionField from '../../Components/Fields/Accordion';


const AccountSection = (props) => {
    const {
        homePageState,
    } = useContext(AppContext);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalProps, setModalProps] = useState({});
    const [disclaimerTitle,setDisclaimerTitle]=useState("")
    const [description,setDesription] = useState("")
    
    //show the first modal where the user is shown a disclaimer note and tasked to input their root asset canister id:
    const show_Disclaimer_Modal = () => {
        setModalIsOpen(true)
        setDisclaimerTitle("Disclaimer")
        setDesription("Please, dont send any tokens to this Principal Address.They will be lost forever.To view it, enter your real asset address")
        setModalProps({
            components: [{
                Component: ShowDisclaimer,
                props:{
                    modalIsOpen,
                    setModalIsOpen,
                    setModalProps,
                    show_Principal_Modal
                }
            }]
        })
    }



    const show_Principal_Modal = (userInputValue) => {
        try {

            let frontendId = homePageState?.canisterData[CANISTER_DATA_FIELDS.frontEndPrincipal]
            if (userInputValue === frontendId) {
                setModalIsOpen(true)
                setDisclaimerTitle("Principal Address")
                setDesription("")
                setModalProps({
                    components: [{
                        Component: ButtonField,
                        props: {
                            text: shortenHexString(frontendId),
                            transparentBackground: false,
                            Icon: ContentCopyIcon,
                            active:true,
                            iconSize: "small",
                            onClick: () => copyText(
                            )
                        }
                    }]
                })
            } else {
                alert("wrong asset canister id")
            }

        } catch (error) {
            console.log("error in setting :", error)

        }

    }

    const testCanisters = ["bs4fi-aaaaa-aaaap-qaabq-cai", "tv6ut-giaaa-aaaap-qbnvq-cai", "22xax-4iaaa-aaaap-qbaiq-cai", "fkkq7-siaaa-aaaap-qaaya-cai", "hxx6x-baaaa-aaaap-qaaxq-cai"]

    return (
        <>
            <Grid
                container
                columns={12}
                xs={12}
                rowSpacing={8}
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection={"column"}
            >
                <NavBar context={UI_CONTEXTS.ACCOUNT_PAGE} />

                <Grid
                    columns={12}
                    xs={11}
                    md={9}
                    rowSpacing={0}
                    display="flex"
                    justifyContent="evenly"
                    alignItems="evenly"
                    flexDirection={"column"}
                    marginTop={"60px"}
                >
                    <DataField
                        label={'Asset Canister ID'}
                        text={`${shortenHexString(homePageState.canisterData[CANISTER_DATA_FIELDS.frontEndPrincipal])}`}
                        buttonIcon={ContentCopyIcon}
                        onClick={
                            () => copyText(
                                homePageState.canisterData[CANISTER_DATA_FIELDS.frontEndPrincipal]
                            )
                        }
                    />

                    {
                        testCanisters?.length > 0 &&

                        <Grid
                            columns={12}
                            xs={11}
                            md={9}
                            rowSpacing={0}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            gap={4}
                            flexDirection={"column"}
                            marginTop={"60px"}
                            width={"100%"}
                        >
                            <AccordionField>
                                {
                                    testCanisters?.map((test, index) => {
                                        return (
                                            <div
                                                key={index}
                                                title={test}
                                            // iconSize={"medium"}

                                            ></div>
                                        )
                                    })
                                }
                            </AccordionField>
                        </Grid>
                    }

                    <Grid
                        columns={12}
                        xs={11}
                        md={9}
                        rowSpacing={0}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection={"column"}
                        marginTop={"60px"}
                    >
                        <ButtonField
                            text={"View Principal Address"}
                            transparentBackground={false}
                            onClick={show_Disclaimer_Modal}
                            // active={true}
                            // color="red"
                            
                        />
                    </Grid>
                </Grid>
                <ModalComponent
                    open={modalIsOpen}
                    bigText={disclaimerTitle}
                    smallText={description}
                    handleClose={() => setModalIsOpen(false)}
                    {...modalProps}
                />



            </Grid>


        </>
    )

};

export default AccountSection;


import React, {useReducer, createContext, useEffect, useState, useMemo} from 'react';
import journalReducer, { types, initialState } from '../reducers/journalReducer';
import accountReducer , {accountTypes, accountInitialState} from '../reducers/accountReducer';
import AccountSection from './Pages/AccountPage';
import { useLocation } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import { UI_CONTEXTS } from '../functionsAndConstants/Contexts';
import { recoverState, loadAllDataIntoReduxStores, allStatesLoaded  } from '../functionsAndConstants/loadingFunctions';
import { useConnect } from '@connect2ic/react';
import { DEFAULT_APP_CONTEXTS } from '../functionsAndConstants/Constants';
import walletReducer,{ walletInitialState, walletTypes } from '../reducers/walletReducer';
import homePageReducer, { homePageInitialState, homePageTypes } from '../reducers/homePageReducer';
import actorReducer, { actorInitialState,actorTypes } from "../reducers/actorReducer";
import notificationsReducer, {notificationsInitialState, notificationsTypes} from "../reducers/notificationsReducer";
import treasuryReducer, {treasuryPageInitialState, treasuryTypes} from "../reducers/treasuryReducer";
import ModalComponent from '../Components/modal/Modal';

export const AppContext = createContext(DEFAULT_APP_CONTEXTS);

const AccountPage = () => {

    const [journalState, journalDispatch] = useReducer(journalReducer, initialState);
    const [treasuryState, treasuryDispatch] = useReducer(treasuryReducer, treasuryPageInitialState);
    const [notificationsState, notificationsDispatch] = useReducer(notificationsReducer, notificationsInitialState);
    const [accountState, accountDispatch] = useReducer(accountReducer, accountInitialState);
    const [walletState, walletDispatch]=useReducer(walletReducer,walletInitialState);
    const [homePageState, homePageDispatch]=useReducer(homePageReducer,homePageInitialState);
    const [actorState, actorDispatch] = useReducer(actorReducer, actorInitialState);
    const [stateHasBeenRecovered, setStateHasBeenRecovered] = useState(false);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [modalProps, setModalProps] = useState({});

    //clears useLocation().state upon page refresh so that when the user refreshes the page,
    //changes made to this route aren't overrided by the useLocation().state of the previous route.
    window.onbeforeunload = window.history.replaceState(null, '');

    const connectionResult = useConnect({ onConnect: () => {}, onDisconnect: () => {} });

    const ReducerDispatches={
        walletDispatch,
        journalDispatch,
        accountDispatch,
        homePageDispatch,
        actorDispatch,
        notificationsDispatch,
        treasuryDispatch
    }

    const ReducerTypes={
        journalTypes:types,
        walletTypes,
        accountTypes,
        homePageTypes,
        actorTypes,
        notificationsTypes,
        treasuryTypes
    }

    const ReducerStates = {
        journalState,
        walletState,
        accountState,
        homePageState,
        actorState,
        notificationsState,
        treasuryState
    };

    // gets state from previous route
    const location = useLocation();

    // dispatch state from previous route to redux store if that state exists
    recoverState( location, ReducerDispatches, ReducerTypes, connectionResult, setStateHasBeenRecovered );

    useEffect(async () => {
        if(!actorState.backendActor) return;
        try{
            setIsLoadingModal(true);
            setModalIsOpen(true);
            let response = await loadAllDataIntoReduxStores(ReducerStates, ReducerDispatches, ReducerTypes, stateHasBeenRecovered);
            setModalIsOpen(response?.openModal);
            setModalProps(response)
            setIsLoadingModal(false);    
        } catch(e){ connectionResult.disconnect(); document.location.reload(); }
    },[actorState.backendActor]);

    const displayComponent = useMemo(() => {
        return connectionResult.isConnected && allStatesLoaded({
            journalState,
            treasuryState,
            notificationsState,
            walletState,
            accountState,
            homePageState
        });
    },[
        connectionResult.isConnected, 
        accountState.dataHasBeenLoaded,
        treasuryState.dataHasBeenLoaded,
        journalState.dataHasBeenLoaded,
        walletState.dataHasBeenLoaded,
        homePageState.dataHasBeenLoaded,
        notificationsState.dataHasBeenLoaded,
        actorState.dataHasBeenLoaded
    ])

    return (
        <AppContext.Provider 
            value={{
                journalState,
                journalDispatch,
                accountDispatch,
                accountState,
                walletDispatch,
                walletState,
                homePageState,
                homePageDispatch,
                actorState,
                actorDispatch,
                notificationsState,
                notificationsDispatch,
                treasuryState,
                treasuryDispatch
            }}
        >
            {
                displayComponent ? 
                    <AccountSection/> : 
                    <LoginPage
                        context={UI_CONTEXTS.ACCOUNT_PAGE}
                    /> 
            }
            <ModalComponent 
                {...modalProps}
                open={modalIsOpen} 
                isLoading={isLoadingModal} 
            />        
        </AppContext.Provider>
    )

};

export default AccountPage;