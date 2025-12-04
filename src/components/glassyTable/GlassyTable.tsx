import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';

export const GlassyTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: 20,
  overflow: 'hidden',
  background: 'rgba(15,23,42,0.75)',
  border: '1px solid rgba(148,163,184,0.45)',
  boxShadow: '0 18px 45px rgba(15,23,42,0.7)',
  backdropFilter: 'blur(18px) saturate(140%)',
  WebkitBackdropFilter: 'blur(18px) saturate(140%)',
}));

export const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.08,
  textTransform: 'uppercase',
  color: 'rgba(226,232,240,0.96)',
  borderBottom: '1px solid rgba(148,163,184,0.6)',
  background:
    'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.75))',
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
}));

export const BodyRow = styled(TableRow)(({ theme }) => ({
  transition: 'background 120ms ease-out, transform 120ms ease-out',
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(15,23,42,0.60)',
  },
  '&:nth-of-type(even)': {
    backgroundColor: 'rgba(15,23,42,0.45)',
  },
  '&:hover': {
    backgroundColor: 'rgba(56,189,248,0.18)',
    transform: 'translateY(-1px)',
  },
}));

export const BodyCell = styled(TableCell)(({ theme }) => ({
  fontSize: 13,
  color: 'rgba(226,232,240,0.9)',
  borderBottom: '1px solid rgba(148,163,184,0.28)',
  paddingTop: theme.spacing(1.25),
  paddingBottom: theme.spacing(1.25),
}));
