import React, {
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  useState,
  useRef,
  useEffect,
} from 'react';
import { Grid, Typography, Fab, CircularProgress, Box } from '@mui/material';
import StepNavigation from '../StepNavigation';
import {
  DoneOutline,
  DownloadingOutlined,
  ComputerOutlined,
  RocketLaunchOutlined,
  KeyOutlined,
  ErrorOutline,
} from '@mui/icons-material';
import styled from '@emotion/styled';

import { green, red } from '@mui/material/colors';
import { InstallDetails } from '../../../electron/IMultiClientInstaller';
import { ImportKeystore } from '../ImportKeystore';

type InstallProps = {
  onStepBack: () => void;
  onStepForward: () => void;
  installationDetails: InstallDetails;
  setInstallationDetails: Dispatch<SetStateAction<InstallDetails>>;
};

const ContentGrid = styled(Grid)`
  height: 320px;
  margin-top: 16px;
  margin-bottom: 16px;
`;

/**
 * This page is the third step of the install process where the software is being installed.
 *
 * @param props the data and functions passed in, they are self documenting
 * @returns
 */
const Install: FC<InstallProps> = (props): ReactElement => {
  const [loadingPreInstall, setLoadingPreInstall] = useState(false);
  const [loadingInstall, setLoadingInstall] = useState(false);
  const [loadingKeyImport, setLoadingKeyImport] = useState(false);
  const [loadingPostInstall, setLoadingPostInstall] = useState(false);

  const [failedPreInstall, setFailedPreInstall] = useState(false);
  const [failedInstall, setFailedInstall] = useState(false);
  const [failedKeyImport, setFailedKeyImport] = useState(false);
  const [failedPostInstall, setFailedPostInstall] = useState(false);

  const [successPreInstall, setSuccessPreInstall] = useState(false);
  const [successInstall, setSuccessInstall] = useState(false);
  const [successKeyImport, setSuccessKeyImport] = useState(false);
  const [successPostInstall, setSuccessPostInstall] = useState(false);
  // const resolveModal = useRef<(arg: () => Promise<boolean> => void)>(Promise.resolve);
  const resolveModal = useRef<(arg: () => Promise<boolean>) => void>();

  const [disableBack, setDisableBack] = useState<boolean>(true);
  const [disableForward, setDisableForward] = useState<boolean>(true);

  const buttonPreInstallSx = {
    ...(failedPreInstall
      ? {
          bgcolor: '#ffc107',
          '&:hover': {
            bgcolor: '#ffc107',
          },
        }
      : successPreInstall && {
          bgcolor: green[500],
          '&:hover': {
            bgcolor: green[700],
          },
        }),
  };

  const buttonInstallSx = {
    ...(failedInstall
      ? {
          bgcolor: '#ffc107',
          '&:hover': {
            bgcolor: '#ffc107',
          },
        }
      : successInstall && {
          bgcolor: green[500],
          '&:hover': {
            bgcolor: green[700],
          },
        }),
  };

  const buttonKeyImportSx = {
    ...(failedKeyImport
      ? {
          bgcolor: '#ffc107',
          '&:hover': {
            bgcolor: '#ffc107',
          },
        }
      : successKeyImport && {
          bgcolor: green[500],
          '&:hover': {
            bgcolor: green[700],
          },
        }),
  };

  const buttonPostInstallSx = {
    ...(failedPostInstall
      ? {
          bgcolor: '#ffc107',
          '&:hover': {
            bgcolor: '#ffc107',
          },
        }
      : successPostInstall && {
          bgcolor: green[500],
          '&:hover': {
            bgcolor: green[700],
          },
        }),
  };

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [keyStorePath, setKeystorePath] = useState<string>('');
  const [keystorePassword, setKeystorePassword] = useState<string>('');

  const bufferLoad: () => Promise<boolean> = () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1500);
    });
  };

  const handlePreInstall: () => Promise<boolean> = () => {
    if (props.installationDetails.debug === true) {
      return new Promise((resolve) => {
        setSuccessPreInstall(false);
        setLoadingPreInstall(true);
        setTimeout(() => {
          setSuccessPreInstall(true);
          setLoadingPreInstall(false);
          resolve(true);
        }, 1500);
      });
    }
    return new Promise((resolve) => {
      if (!loadingPreInstall) {
        setSuccessPreInstall(false);
        setLoadingPreInstall(true);

        Promise.all([window.ethDocker.preInstall(), bufferLoad()]).then(
          (res) => {
            setSuccessPreInstall(true);
            setLoadingPreInstall(false);
            resolve(res[0]);
          },
        );
      }
    });
  };

  const handleInstall: () => Promise<boolean> = () => {
    if (props.installationDetails.debug === true) {
      return new Promise((resolve) => {
        setSuccessInstall(false);
        setLoadingInstall(true);
        setTimeout(() => {
          setSuccessInstall(true);
          setLoadingInstall(false);
          resolve(true);
        }, 1500);
      });
    }
    return new Promise((resolve) => {
      if (!loadingInstall) {
        setSuccessInstall(false);
        setLoadingInstall(true);

        Promise.all([
          window.ethDocker.install(props.installationDetails),
          bufferLoad(),
        ]).then((res) => {
          setSuccessInstall(true);
          setLoadingInstall(false);
          resolve(res[0]);
        });
      }
    });
  };

  const handleKeyImportModal: () => Promise<boolean> = () => {
    if (props.installationDetails.debug === true) {
      return new Promise((resolve) => {
        setSuccessKeyImport(false);
        setLoadingKeyImport(true);
        setTimeout(() => {
          setSuccessKeyImport(true);
          setLoadingKeyImport(false);
          resolve(true);
        }, 1500);
      });
    }
    return new Promise((resolve: (arg: () => Promise<boolean>) => void) => {
      setSuccessKeyImport(false);
      setLoadingKeyImport(true);
      setModalOpen(true);
      resolveModal.current = resolve;
    })
      .then((keyImp: () => Promise<boolean>) => {
        return new Promise((resolve: (arg: boolean) => void) => {
          Promise.all([keyImp(), bufferLoad()])
            .then((res) => {
              setSuccessKeyImport(true);
              setLoadingKeyImport(false);
              resolve(res[0]);
            })
            .catch((err) => {
              console.error('error importing key: ', err);
              setLoadingKeyImport(false);
              resolve(false);
            });
        });
      })
      .catch((err) => {
        console.error('error filling out key import modal: ', err);
        setLoadingKeyImport(false);
        return false;
      });
  };

  const handlePostInstall: () => Promise<boolean> = () => {
    if (props.installationDetails.debug === true) {
      return new Promise((resolve) => {
        setSuccessPostInstall(false);
        setLoadingPostInstall(true);
        setTimeout(() => {
          setSuccessPostInstall(true);
          setLoadingPostInstall(false);
          resolve(true);
        }, 1500);
      });
    }
    return new Promise((resolve) => {
      if (!loadingPostInstall) {
        setSuccessPostInstall(false);
        setLoadingPostInstall(true);

        Promise.all([
          window.ethDocker.postInstall(props.installationDetails.network),
          bufferLoad(),
        ]).then((res) => {
          setSuccessPostInstall(true);
          setLoadingPostInstall(false);
          resolve(res[0]);
        });
      }
    });
  };

  const install = async (step: number) => {
    if (!step) {
      step = 0;
    }

    switch (step) {
      case 0:
        setFailedPreInstall(false);
        let preInstallResult = await handlePreInstall();
        if (!preInstallResult) {
          setFailedPreInstall(true);
          setDisableBack(false);
          return;
        }
        step = 1;
      case 1:
        setFailedInstall(false);
        let installResult = await handleInstall();
        if (!installResult) {
          setFailedInstall(true);
          setDisableBack(false);
          return;
        }
        step += 1;

      case 2:
        setFailedKeyImport(false);
        let keyImportResult = await handleKeyImportModal();
        if (!keyImportResult) {
          setFailedKeyImport(true);
          setDisableBack(false);
          return;
        }
        step += 1;

      case 3:
        setFailedPostInstall(false);
        let postInstallResult = await handlePostInstall();
        if (!postInstallResult) {
          setFailedPostInstall(true);
          setDisableBack(false);
          return;
        }
    }

    setDisableForward(false);
    setDisableBack(true);
  };

  useEffect(() => {
    install(0);
  }, []);

  return (
    <Grid item container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h1" align="center">
          Installing
        </Typography>
      </Grid>
      <ContentGrid item container>
        <Grid item container>
          <Grid item xs={3}></Grid>
          <Grid
            item
            container
            justifyContent="center"
            alignItems="center"
            xs={2}
          >
            <Box sx={{ m: 1, position: 'relative' }}>
              <Fab
                aria-label="save"
                color="primary"
                sx={buttonPreInstallSx}
                disabled={!failedPreInstall}
                onClick={failedPreInstall ? () => install(0) : () => {}}
              >
                {!failedPreInstall ? (
                  successPreInstall ? (
                    <DoneOutline
                      sx={{
                        color: green[500],
                      }}
                    />
                  ) : (
                    <DownloadingOutlined />
                  )
                ) : (
                  <ErrorOutline sx={{ color: red[500] }} />
                )}
              </Fab>
              {loadingPreInstall && (
                <CircularProgress
                  size={68}
                  sx={{
                    color: green[500],
                    position: 'absolute',
                    top: -6,
                    left: -6,
                    zIndex: 1,
                  }}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid
            item
            container
            justifyContent="flex-start"
            alignItems="center"
            xs={3}
          >
            <span>Downloading dependencies</span>
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
        <Grid item container>
          <Grid item xs={3}></Grid>
          <Grid
            item
            container
            justifyContent="center"
            alignItems="center"
            xs={2}
          >
            <Box sx={{ m: 1, position: 'relative' }}>
              <Fab
                aria-label="save"
                color="primary"
                sx={buttonInstallSx}
                disabled={!failedInstall}
                onClick={failedInstall ? () => install(1) : () => {}}
              >
                {!failedInstall ? (
                  successInstall ? (
                    <DoneOutline
                      sx={{
                        color: green[500],
                      }}
                    />
                  ) : (
                    <ComputerOutlined />
                  )
                ) : (
                  <ErrorOutline sx={{ color: red[500] }} />
                )}
              </Fab>
              {loadingInstall && (
                <CircularProgress
                  size={68}
                  sx={{
                    color: green[500],
                    position: 'absolute',
                    top: -6,
                    left: -6,
                    zIndex: 1,
                  }}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid
            item
            container
            justifyContent="flex-start"
            alignItems="center"
            xs={4}
          >
            <span>Installing services</span>
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
        <Grid item container>
          <Grid item xs={3}></Grid>
          <Grid
            item
            container
            justifyContent="center"
            alignItems="center"
            xs={2}
          >
            <Box sx={{ m: 1, position: 'relative' }}>
              <Fab
                aria-label="save"
                color="primary"
                sx={buttonKeyImportSx}
                disabled={!failedKeyImport}
                onClick={failedKeyImport ? () => install(2) : () => {}}
              >
                {!failedKeyImport ? (
                  successKeyImport ? (
                    <DoneOutline
                      sx={{
                        color: green[500],
                      }}
                    />
                  ) : (
                    <KeyOutlined />
                  )
                ) : (
                  <ErrorOutline sx={{ color: red[500] }} />
                )}
              </Fab>
              {loadingKeyImport && (
                <CircularProgress
                  size={68}
                  sx={{
                    color: green[500],
                    position: 'absolute',
                    top: -6,
                    left: -6,
                    zIndex: 1,
                  }}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid
            item
            container
            justifyContent="flex-start"
            alignItems="center"
            xs={4}
          >
            <span>Key Import</span>
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
        <Grid item container>
          <Grid item xs={3}></Grid>
          <Grid
            item
            container
            justifyContent="center"
            alignItems="center"
            xs={2}
          >
            <Box sx={{ m: 1, position: 'relative' }}>
              <Fab
                aria-label="save"
                color="primary"
                sx={buttonPostInstallSx}
                disabled={!failedPostInstall}
                onClick={failedPostInstall ? () => install(3) : () => {}}
              >
                {!failedPostInstall ? (
                  successPostInstall ? (
                    <DoneOutline
                      sx={{
                        color: green[500],
                      }}
                    />
                  ) : (
                    <RocketLaunchOutlined />
                  )
                ) : (
                  <ErrorOutline sx={{ color: red[500] }} />
                )}
              </Fab>
              {loadingPostInstall && (
                <CircularProgress
                  size={68}
                  sx={{
                    color: green[500],
                    position: 'absolute',
                    top: -6,
                    left: -6,
                    zIndex: 1,
                  }}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid
            item
            container
            justifyContent="flex-start"
            alignItems="center"
            xs={4}
          >
            <span>Configuring and launching</span>
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      </ContentGrid>
      {/* props.children is the stepper */}
      {props.children}
      <StepNavigation
        onPrev={props.onStepBack}
        onNext={props.onStepForward}
        backLabel={'Back'}
        nextLabel={'Finish'}
        disableBack={disableBack}
        disableNext={disableForward}
      />
      <ImportKeystore
        setModalOpen={setModalOpen}
        isModalOpen={isModalOpen}
        setKeystorePassword={setKeystorePassword}
        setKeystorePath={setKeystorePath}
        keyStorePath={keyStorePath}
        keystorePassword={keystorePassword}
        closing={resolveModal}
        installationDetails={props.installationDetails}
      />
    </Grid>
  );
};

export default Install;
