set -e

# use your identities here
dfx identity use ic_admin

dfx deploy

BACKEND_CANISTER=$(dfx canister id IcpAccelerator_backend)
ASSET_CANISTER=$(dfx canister id asset_canister_backend)
echo "Backend Canister ID: $BACKEND_CANISTER"
echo "Asset Canister ID: $ASSET_CANISTER"
dfx canister call asset_canister_backend authorize '(principal "'$BACKEND_CANISTER'")'

# upload default user
dfx canister call asset_canister_backend store 'record {key="/uploads/default_user.jpeg"; content=vec {255;216;255;224;0;16;74;70;73;70;0;1;1;0;0;1;0;1;0;0;255;219;0;67;0;7;7;7;7;8;7;8;9;9;8;12;12;11;12;12;17;16;14;14;16;17;26;18;20;18;20;18;26;39;24;29;24;24;29;24;39;35;42;34;32;34;42;35;62;49;43;43;49;62;72;60;57;60;72;87;78;78;87;109;104;109;143;143;192;255;194;0;11;8;1;244;1;244;1;1;17;0;255;196;0;28;0;1;0;2;2;3;1;0;0;0;0;0;0;0;0;0;0;0;5;7;4;6;1;2;3;8;255;218;0;8;1;1;0;0;0;0;250;68;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;242;197;241;235;223;39;43;144;0;0;0;0;0;1;31;173;193;195;98;7;30;146;147;155;28;231;96;0;0;0;0;0;227;85;211;225;128;1;239;181;238;153;192;0;0;0;0;13;95;66;192;0;0;115;181;216;25;0;0;0;0;0;194;173;224;0;0;1;237;96;237;160;0;0;0;2;2;178;199;0;0;0;218;172;126;224;0;0;0;26;165;113;212;0;0;0;154;181;61;128;0;0;0;213;43;126;0;0;0;2;94;215;246;0;0;0;8;10;179;168;0;101;75;250;199;197;112;0;19;246;159;96;0;0;3;14;160;198;0;18;54;6;197;201;143;162;233;160;1;188;111;128;0;0;5;85;0;0;39;109;47;80;53;90;167;47;144;2;220;152;0;0;0;214;107;16;1;155;112;123;128;87;149;124;142;111;32;18;150;247;96;0;0;58;211;152;0;2;199;219;64;29;62;124;141;246;146;203;228;5;145;182;0;0;1;170;86;192;3;155;183;216;0;171;43;163;222;75;43;144;72;220;92;128;0;2;165;133;0;25;183;56;0;210;41;224;200;146;202;5;173;60;0;0;24;20;208;0;103;220;160;3;71;167;192;201;147;200;27;93;146;0;0;26;93;126;0;29;174;254;224;5;99;90;128;101;73;100;61;238;206;64;0;5;93;174;0;2;208;217;0;10;2;24;0;204;146;246;184;37;0;0;5;45;136;0;9;75;123;176;6;147;78;128;7;57;150;214;226;0;0;116;163;128;0;109;150;63;32;64;81;216;224;0;88;246;136;0;1;29;78;0;0;79;216;178;3;207;66;171;252;0;0;110;215;16;0;1;17;81;0;0;57;151;205;69;234;248;64;0;13;178;236;0;0;34;170;0;0;3;134;36;111;136;0;1;181;221;160;0;4;85;64;0;7;166;197;63;43;157;146;233;27;15;1;168;66;128;1;184;93;0;0;6;45;41;200;0;247;222;118;255;0;80;7;16;21;142;170;0;27;229;184;0;0;113;71;244;0;39;44;220;176;0;52;106;147;204;0;180;44;128;0;1;81;68;0;39;237;46;224;0;26;189;37;208;1;117;237;160;0;2;189;211;64;51;173;255;0;112;0;2;190;170;0;57;250;47;48;0;0;107;149;112;5;155;179;128;0;14;180;36;32;9;235;232;0;0;58;82;190;0;103;92;188;128;0;6;141;80;0;180;108;112;0;0;87;186;104;27;157;130;0;0;12;95;156;184;7;127;161;179;192;0;1;131;77;112;11;39;107;0;0;3;231;108;0;110;247;8;0;0;10;227;82;5;143;182;128;0;1;243;174;8;119;250;2;84;0;0;6;45;55;226;27;69;152;0;0;8;106;0;22;45;166;0;0;0;213;43;96;230;214;157;0;0;29;41;29;96;37;239;191;96;0;0;7;21;182;170;29;247;73;201;16;0;24;176;181;204;8;123;94;179;160;0;0;3;206;169;133;7;72;252;14;160;0;1;205;203;185;0;0;0;3;198;168;136;3;164;118;7;0;0;14;109;205;236;0;0;0;7;133;101;175;128;243;142;193;224;0;15;107;127;115;0;0;0;0;113;161;233;0;30;81;184;64;1;47;113;207;0;0;0;0;4;45;115;22;1;227;27;137;192;14;246;21;153;238;0;0;0;0;7;93;87;72;142;0;240;141;196;14;251;165;151;44;0;0;0;0;0;113;7;169;235;152;224;49;227;113;167;119;77;223;60;0;0;0;0;0;7;17;81;49;184;94;28;122;101;231;202;202;102;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;255;196;0;71;16;0;2;1;2;3;3;7;7;10;3;6;7;1;0;0;0;1;2;3;4;5;0;6;17;33;34;81;18;19;48;49;64;65;97;22;32;82;85;113;129;161;7;20;35;50;66;80;98;114;145;177;51;83;146;16;21;130;144;193;209;36;52;53;54;67;68;99;162;255;218;0;8;1;1;0;1;63;0;255;0;37;55;169;166;140;111;207;26;123;88;12;53;226;208;131;122;190;45;125;184;108;195;100;81;201;21;203;226;64;56;92;199;99;215;122;176;127;73;194;95;108;207;255;0;189;24;56;138;227;110;151;64;149;176;255;0;88;194;178;48;213;88;31;97;215;239;90;171;181;182;144;30;126;169;67;122;35;107;98;167;57;64;186;138;122;102;127;23;58;98;124;215;119;151;80;146;44;67;130;12;77;112;174;156;147;45;84;173;237;99;130;73;235;243;146;89;99;58;164;140;190;194;70;32;191;93;224;211;145;88;228;14;230;222;31;28;83;231;74;212;209;103;130;57;0;225;186;113;73;155;45;51;242;22;70;120;124;31;171;245;24;138;88;102;64;241;200;174;188;84;235;247;116;142;145;161;121;28;42;142;178;78;128;98;191;54;81;193;170;83;3;59;241;234;92;86;223;238;117;154;135;156;162;122;9;186;58;122;122;170;154;103;15;4;207;27;113;83;166;40;51;141;92;68;45;92;98;101;239;97;186;216;183;221;237;245;203;172;19;239;250;7;99;125;212;72;3;83;139;158;104;164;165;229;71;78;4;210;255;0;248;92;87;92;235;107;159;149;60;164;142;229;27;20;123;187;26;179;43;6;82;65;29;68;108;35;22;204;215;87;74;68;117;90;205;31;31;182;49;69;112;164;175;132;53;52;161;134;155;195;168;131;227;247;61;117;194;150;134;35;44;242;105;192;119;159;96;197;215;48;213;215;146;138;76;80;122;0;237;62;222;207;79;83;61;52;171;44;18;178;56;234;35;22;140;209;13;73;88;107;52;142;94;160;253;74;223;114;222;111;240;91;212;198;186;60;231;169;59;151;219;138;186;186;138;201;140;211;200;93;143;232;7;1;218;172;153;150;106;34;144;84;147;37;63;234;201;136;103;138;120;86;72;156;58;48;212;17;247;21;251;48;173;32;106;122;98;12;253;237;214;19;14;239;35;179;187;22;98;117;36;237;39;182;89;175;117;54;185;118;18;208;177;223;79;245;24;164;171;167;171;129;38;133;249;72;195;227;192;253;193;152;111;194;145;77;53;59;107;57;27;91;208;24;36;146;73;58;146;123;117;158;241;61;178;163;148;164;152;152;239;167;17;138;122;136;42;160;142;104;95;148;142;59;117;250;242;150;232;57;17;237;157;198;224;224;61;35;135;118;119;103;118;44;204;117;36;245;147;211;83;208;214;84;144;32;167;146;79;98;156;69;149;175;82;105;255;0;14;23;95;73;128;193;202;55;145;246;35;39;128;124;79;97;187;66;9;106;55;35;138;239;126;216;101;101;36;48;32;142;227;176;244;214;27;211;219;167;228;72;73;167;115;190;61;31;196;48;142;174;138;234;65;82;53;4;118;203;133;116;52;52;178;79;33;216;163;96;239;102;238;24;171;171;154;178;162;73;230;109;89;207;232;56;14;150;221;107;171;184;73;201;129;55;71;214;115;177;70;45;217;98;223;74;3;76;188;252;156;91;171;220;48;170;170;0;80;0;29;64;121;149;118;250;26;184;185;53;20;232;231;143;120;247;226;237;148;166;129;76;212;68;202;157;233;246;198;56;142;7;165;202;151;174;109;133;4;239;186;223;193;110;4;247;118;178;64;198;97;186;154;250;178;168;223;65;17;33;60;79;30;150;201;101;146;229;47;41;181;88;16;239;183;31;1;136;41;225;166;137;98;134;48;145;175;80;29;6;99;203;43;94;178;85;81;129;21;82;251;150;79;3;129;84;81;218;41;208;163;169;209;129;238;56;4;17;168;58;244;96;149;32;131;161;7;102;50;245;212;92;104;199;47;78;126;61;21;199;30;7;181;102;171;145;164;164;20;209;157;37;156;109;226;169;210;219;232;165;174;171;138;158;62;182;59;79;1;199;20;180;208;210;193;28;16;174;136;131;65;209;103;155;0;120;205;210;157;55;147;65;56;28;59;155;17;205;36;103;117;177;21;106;54;199;221;63;12;2;8;212;116;86;123;139;91;171;163;155;236;29;217;7;21;56;70;87;69;117;32;171;0;65;237;15;34;70;142;238;116;85;4;147;192;12;92;235;94;186;182;105;219;168;157;20;112;81;212;58;92;163;66;33;164;122;182;27;242;157;23;193;71;71;36;105;44;111;27;168;100;117;33;135;16;113;119;160;107;117;202;170;148;245;35;238;248;169;218;15;246;69;60;145;29;211;179;134;34;172;141;246;54;233;232;178;141;199;158;166;122;73;27;126;17;170;120;175;104;205;149;252;197;18;211;33;223;152;237;252;163;165;85;44;193;71;89;32;98;150;33;5;44;16;40;208;70;129;122;79;148;58;64;181;148;117;96;127;17;10;31;106;121;145;84;75;23;81;217;192;226;42;184;223;97;221;62;61;5;166;185;168;43;224;168;7;98;182;141;226;167;175;10;193;130;176;58;130;53;29;159;48;215;124;246;235;81;32;58;162;30;66;123;23;165;182;32;123;141;26;158;249;147;247;233;126;80;162;83;105;165;113;214;149;31;184;243;162;169;150;46;163;168;224;113;21;92;82;108;215;146;120;31;63;43;214;252;234;214;136;199;87;132;242;15;179;187;179;93;234;126;101;109;169;155;93;240;154;47;181;182;14;154;212;193;46;84;76;127;156;159;191;75;159;216;45;158;157;117;218;245;3;224;15;65;21;84;177;247;234;56;28;69;83;20;155;53;208;240;62;110;80;172;230;46;70;18;119;103;77;61;227;179;103;42;146;176;83;83;15;182;197;207;176;116;209;185;142;68;113;214;172;15;233;136;101;89;161;138;64;117;14;129;135;188;116;159;40;149;35;157;161;164;4;106;161;164;110;138;42;185;99;216;119;135;3;136;170;34;147;168;232;120;31;237;165;157;169;234;97;152;117;198;225;191;67;133;101;116;87;7;80;192;17;217;115;84;252;229;222;68;238;137;85;58;124;169;112;231;237;134;156;145;203;128;233;254;19;209;146;20;18;78;128;98;255;0;113;254;241;187;84;212;3;185;175;37;63;42;244;145;86;72;155;27;120;98;41;227;151;234;157;188;63;178;193;80;42;44;244;172;78;213;78;79;188;108;236;183;9;140;245;213;82;147;175;42;86;63;30;158;205;114;107;117;116;115;117;161;221;144;113;92;71;36;114;70;146;70;193;149;128;32;142;139;58;95;5;29;25;161;133;190;158;113;189;197;19;166;4;131;136;171;100;77;143;188;62;56;201;21;145;207;110;169;140;29;76;114;235;167;14;80;236;149;14;34;164;168;144;157;57;49;177;30;225;130;117;58;246;12;185;152;13;11;138;106;134;60;193;59;15;161;133;101;101;12;172;8;35;80;71;65;127;204;20;182;138;114;73;15;59;15;163;139;253;78;42;234;167;172;168;150;162;119;47;36;135;82;123;7;201;204;225;43;43;226;61;240;171;126;135;178;94;95;145;106;174;111;254;45;241;217;216;173;25;130;174;221;164;103;233;32;215;234;30;239;102;40;47;20;23;5;81;12;192;55;160;219;8;243;101;150;40;80;188;178;42;32;235;102;58;12;94;179;197;60;33;161;183;125;44;157;242;159;168;61;156;113;83;83;61;84;207;52;242;52;146;57;212;179;109;39;176;228;25;57;55;221;9;208;60;14;59;38;97;58;89;107;127;40;31;169;236;96;144;65;7;66;49;79;152;47;52;192;8;235;9;3;168;56;229;140;12;247;117;131;248;212;48;184;226;9;24;111;148;106;158;71;36;91;163;247;185;197;70;124;189;202;165;98;16;194;15;162;186;159;142;43;46;53;213;207;202;170;169;146;83;248;142;207;112;236;121;37;180;204;84;190;40;255;0;183;100;204;202;127;185;106;244;234;0;126;227;179;75;69;27;237;93;211;137;96;146;35;188;54;113;236;153;43;254;227;163;246;63;237;217;47;170;94;205;93;179;170;61;123;4;48;77;59;242;34;141;157;184;40;215;20;185;78;233;48;13;40;72;65;244;142;167;244;24;135;38;82;70;7;63;83;35;158;240;55;113;22;92;178;198;63;229;121;71;241;49;56;91;109;185;52;228;81;66;63;192;49;243;106;101;26;8;35;30;197;24;104;105;244;211;153;79;233;24;150;138;133;193;83;73;9;7;138;3;137;114;229;134;96;121;118;216;118;250;35;147;138;156;141;97;148;107;23;61;17;252;45;175;239;138;191;147;170;144;91;230;117;169;39;131;141;49;95;151;175;22;253;77;69;27;242;125;53;222;95;212;118;12;140;160;230;8;137;26;133;138;67;217;46;16;153;109;213;171;167;92;47;251;116;212;212;181;21;82;136;160;137;157;207;112;197;183;40;68;160;73;91;39;44;255;0;45;118;15;121;196;20;244;244;201;200;134;21;141;71;114;142;146;233;149;108;247;16;204;97;17;75;252;200;247;113;122;202;87;59;94;178;5;231;224;244;208;109;31;152;116;223;39;209;147;117;169;147;208;167;63;19;217;25;67;35;41;239;4;98;84;49;203;34;30;181;98;63;67;210;89;236;117;23;39;229;29;99;128;29;231;227;224;49;71;65;75;67;8;138;158;48;163;188;247;147;196;244;228;3;140;195;146;224;171;15;83;111;65;20;253;102;47;178;255;0;236;113;44;50;193;43;197;42;20;116;58;50;157;132;30;147;228;234;45;22;227;63;18;136;59;45;250;14;98;239;88;160;104;11;150;30;198;219;209;216;172;175;113;155;151;38;162;157;14;241;227;224;49;20;81;195;26;199;26;133;69;26;0;59;22;104;203;48;221;96;51;66;21;106;208;110;158;231;28;14;36;142;72;164;120;228;82;174;132;134;83;214;8;232;242;60;28;197;133;31;77;233;165;103;247;13;222;203;156;233;130;86;83;206;163;100;145;233;239;94;138;221;65;45;125;92;116;241;247;157;227;192;119;156;83;83;69;75;4;112;196;188;148;65;160;236;153;231;47;137;35;55;58;100;222;77;147;1;222;190;151;68;1;36;0;54;147;139;117;48;164;183;81;211;1;252;40;149;79;183;191;178;230;154;94;126;212;238;6;173;11;7;247;117;30;139;43;219;190;107;69;207;184;250;73;246;251;19;178;186;171;171;35;40;42;192;130;15;81;24;204;22;163;107;186;79;79;161;230;201;229;70;120;169;232;114;197;9;174;189;209;69;166;170;31;150;254;196;219;217;165;137;37;138;72;156;2;174;164;31;97;197;85;59;211;84;205;3;141;232;220;169;247;116;22;202;67;89;95;79;7;115;54;247;176;109;56;85;10;161;64;208;1;160;29;155;63;219;121;235;124;53;138;187;208;54;135;242;63;67;242;125;64;85;42;171;200;218;223;69;25;253;251;62;113;161;230;170;227;171;69;209;38;26;31;104;232;50;100;0;213;212;84;17;175;54;129;71;181;187;61;198;149;42;173;213;116;231;111;57;19;46;8;32;144;122;193;211;207;142;55;150;68;141;6;172;236;0;30;39;22;170;21;183;219;169;105;87;255;0;26;13;124;88;237;39;179;222;40;18;186;130;104;0;222;211;84;63;136;97;149;149;138;176;208;131;161;30;126;76;80;148;19;190;155;90;111;216;118;139;172;66;27;157;116;99;169;103;113;241;243;242;61;171;231;87;19;87;34;235;21;55;197;207;105;205;150;179;75;89;243;148;31;71;57;219;167;115;249;249;54;80;104;42;99;215;106;203;175;234;59;69;206;81;53;202;182;81;212;243;185;31;175;157;28;111;44;137;26;41;102;102;1;64;239;39;22;59;98;90;237;176;83;15;173;167;42;86;226;231;180;215;209;195;91;69;53;60;131;235;245;55;3;199;21;52;242;211;79;36;18;174;142;141;161;30;118;83;174;90;107;143;50;231;68;156;5;247;142;207;127;185;45;182;211;85;62;186;57;94;68;126;44;222;126;69;178;243;147;27;156;233;185;25;34;16;123;219;188;246;188;211;102;249;204;38;178;4;214;72;134;248;31;105;124;229;98;172;24;29;8;58;131;139;5;238;42;248;21;36;96;42;16;104;227;210;252;67;178;203;44;80;196;242;202;225;35;81;171;49;216;6;51;61;252;221;234;244;143;81;77;22;162;49;199;139;31;58;201;105;154;237;95;29;52;123;23;174;71;244;87;20;212;240;210;193;28;17;47;38;56;212;42;142;217;153;172;159;50;156;212;192;159;65;33;234;244;27;206;142;73;34;117;120;220;171;41;212;17;179;20;57;202;84;64;149;177;25;63;26;245;226;44;213;98;114;3;86;8;143;7;82;49;229;86;93;245;156;56;242;171;46;250;206;28;121;85;151;125;103;14;60;170;203;190;179;135;30;85;101;223;89;195;143;42;178;239;172;225;199;149;89;119;214;112;227;202;172;187;235;56;113;229;86;93;245;156;56;242;171;46;250;206;28;121;85;151;125;103;14;60;170;203;190;179;135;30;85;101;223;89;195;143;42;178;239;172;225;199;149;89;119;214;112;227;202;172;187;235;56;112;249;155;47;40;255;0;169;71;138;220;245;103;129;72;167;18;84;63;128;228;175;234;113;121;204;87;27;177;210;103;9;8;234;137;54;15;127;157;79;4;213;51;199;4;40;94;71;96;170;163;188;156;88;44;113;89;232;132;123;26;103;208;202;252;79;1;224;59;108;208;197;60;79;20;138;25;28;104;65;197;238;205;53;178;163;77;166;23;254;27;249;238;136;227;70;26;226;90;30;248;207;184;225;149;148;232;192;131;217;149;89;152;42;130;88;157;0;27;73;56;202;153;109;109;176;138;170;149;6;170;65;213;252;177;219;234;233;32;171;167;120;38;64;200;113;120;179;212;91;39;228;176;45;19;29;201;56;244;15;26;56;209;148;28;75;66;70;216;206;190;7;12;165;78;140;52;61;141;85;157;130;168;37;137;208;1;180;147;140;171;149;69;8;74;202;212;214;160;141;81;59;163;251;134;162;158;26;168;30;25;144;58;55;88;56;189;88;39;183;57;116;214;74;114;118;63;163;224;221;12;145;36;131;70;93;113;45;19;141;177;157;71;12;16;65;208;130;59;4;20;243;212;204;144;193;27;60;142;116;85;93;164;227;45;229;72;173;160;84;213;1;37;87;194;63;184;221;17;212;163;168;101;35;66;14;209;139;214;85;100;229;207;64;57;75;223;23;120;252;184;32;169;32;130;8;238;232;100;134;57;6;242;251;241;45;19;174;212;222;31;28;105;161;208;244;182;155;45;117;214;110;69;60;123;160;239;200;118;42;226;201;151;232;173;17;125;26;242;230;35;126;86;235;63;115;93;108;20;119;16;207;167;55;55;243;20;124;15;28;92;172;213;214;231;210;120;247;59;164;93;170;122;41;96;142;81;188;54;241;196;180;114;38;213;222;29;20;113;201;43;170;70;133;217;142;129;64;212;156;89;114;44;178;114;39;185;147;26;117;136;65;222;63;155;20;212;208;82;194;177;65;18;198;138;54;42;143;186;29;17;212;171;168;96;122;193;218;49;113;202;52;211;3;45;35;115;47;232;157;170;113;93;105;175;160;98;42;32;96;61;49;181;79;191;162;150;158;41;122;198;222;35;18;210;72;155;70;240;243;163;142;73;28;36;104;89;143;80;3;83;139;86;71;184;213;114;94;172;252;218;62;7;107;156;91;44;118;219;90;1;77;0;15;223;35;109;99;247;99;40;96;85;128;32;245;131;183;21;217;90;215;82;11;162;24;27;138;127;182;43;50;141;202;29;76;5;39;95;13;135;19;210;84;211;177;89;224;120;207;226;4;116;50;211;69;47;88;208;241;24;150;146;88;246;233;202;28;70;0;44;116;3;83;138;28;179;123;174;208;197;68;234;190;155;238;15;142;40;126;79;81;52;106;250;190;81;254;92;88;161;180;219;168;23;147;73;74;145;241;109;53;99;237;39;239;23;69;113;201;101;4;112;35;92;84;88;109;21;4;150;164;85;241;93;211;240;196;249;50;222;195;88;106;101;79;3;163;98;92;149;82;54;199;89;25;240;96;65;195;228;251;186;245;115;68;126;109;63;124;54;84;189;6;211;152;82;124;28;99;201;107;222;186;124;216;127;80;192;202;87;147;215;28;107;237;124;67;146;174;111;245;166;133;7;188;226;12;144;9;2;90;195;227;201;92;69;148;237;16;232;88;60;199;241;54;207;134;41;237;212;20;191;192;164;138;51;196;40;7;252;164;127;255;217;}; content_type="image/*"; content_encoding="identity";}'

# upload default project
dfx canister call asset_canister_backend store 'record {key="/uploads/default_project.jpeg"; content=vec {255;216;255;224;0;16;74;70;73;70;0;1;1;0;0;1;0;1;0;0;255;219;0;67;0;7;7;7;7;8;7;8;9;9;8;12;12;11;12;12;17;16;14;14;16;17;26;18;20;18;20;18;26;39;24;29;24;24;29;24;39;35;42;34;32;34;42;35;62;49;43;43;49;62;72;60;57;60;72;87;78;78;87;109;104;109;143;143;192;255;194;0;11;8;1;244;1;244;1;1;17;0;255;196;0;28;0;1;0;2;2;3;1;0;0;0;0;0;0;0;0;0;0;0;5;7;4;6;1;2;3;8;255;218;0;8;1;1;0;0;0;0;250;68;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;242;197;241;235;223;39;43;144;0;0;0;0;0;1;31;173;193;195;98;7;30;146;147;155;28;231;96;0;0;0;0;0;227;85;211;225;128;1;239;181;238;153;192;0;0;0;0;13;95;66;192;0;0;115;181;216;25;0;0;0;0;0;194;173;224;0;0;1;237;96;237;160;0;0;0;2;2;178;199;0;0;0;218;172;126;224;0;0;0;26;165;113;212;0;0;0;154;181;61;128;0;0;0;213;43;126;0;0;0;2;94;215;246;0;0;0;8;10;179;168;0;101;75;250;199;197;112;0;19;246;159;96;0;0;3;14;160;198;0;18;54;6;197;201;143;162;233;160;1;188;111;128;0;0;5;85;0;0;39;109;47;80;53;90;167;47;144;2;220;152;0;0;0;214;107;16;1;155;112;123;128;87;149;124;142;111;32;18;150;247;96;0;0;58;211;152;0;2;199;219;64;29;62;124;141;246;146;203;228;5;145;182;0;0;1;170;86;192;3;155;183;216;0;171;43;163;222;75;43;144;72;220;92;128;0;2;165;133;0;25;183;56;0;210;41;224;200;146;202;5;173;60;0;0;24;20;208;0;103;220;160;3;71;167;192;201;147;200;27;93;146;0;0;26;93;126;0;29;174;254;224;5;99;90;128;101;73;100;61;238;206;64;0;5;93;174;0;2;208;217;0;10;2;24;0;204;146;246;184;37;0;0;5;45;136;0;9;75;123;176;6;147;78;128;7;57;150;214;226;0;0;116;163;128;0;109;150;63;32;64;81;216;224;0;88;246;136;0;1;29;78;0;0;79;216;178;3;207;66;171;252;0;0;110;215;16;0;1;17;81;0;0;57;151;205;69;234;248;64;0;13;178;236;0;0;34;170;0;0;3;134;36;111;136;0;1;181;221;160;0;4;85;64;0;7;166;197;63;43;157;146;233;27;15;1;168;66;128;1;184;93;0;0;6;45;41;200;0;247;222;118;255;0;80;7;16;21;142;170;0;27;229;184;0;0;113;71;244;0;39;44;220;176;0;52;106;147;204;0;180;44;128;0;1;81;68;0;39;237;46;224;0;26;189;37;208;1;117;237;160;0;2;189;211;64;51;173;255;0;112;0;2;190;170;0;57;250;47;48;0;0;107;149;112;5;155;179;128;0;14;180;36;32;9;235;232;0;0;58;82;190;0;103;92;188;128;0;6;141;80;0;180;108;112;0;0;87;186;104;27;157;130;0;0;12;95;156;184;7;127;161;179;192;0;1;131;77;112;11;39;107;0;0;3;231;108;0;110;247;8;0;0;10;227;82;5;143;182;128;0;1;243;174;8;119;250;2;84;0;0;6;45;55;226;27;69;152;0;0;8;106;0;22;45;166;0;0;0;213;43;96;230;214;157;0;0;29;41;29;96;37;239;191;96;0;0;7;21;182;170;29;247;73;201;16;0;24;176;181;204;8;123;94;179;160;0;0;3;206;169;133;7;72;252;14;160;0;1;205;203;185;0;0;0;3;198;168;136;3;164;118;7;0;0;14;109;205;236;0;0;0;7;133;101;175;128;243;142;193;224;0;15;107;127;115;0;0;0;0;113;161;233;0;30;81;184;64;1;47;113;207;0;0;0;0;4;45;115;22;1;227;27;137;192;14;246;21;153;238;0;0;0;0;7;93;87;72;142;0;240;141;196;14;251;165;151;44;0;0;0;0;0;113;7;169;235;152;224;49;227;113;167;119;77;223;60;0;0;0;0;0;7;17;81;49;184;94;28;122;101;231;202;202;102;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;255;196;0;71;16;0;2;1;2;3;3;7;7;10;3;6;7;1;0;0;0;1;2;3;4;5;0;6;17;33;34;81;18;19;48;49;64;65;97;22;32;82;85;113;129;161;7;20;35;50;66;80;98;114;145;177;51;83;146;16;21;130;144;193;209;36;52;53;54;67;68;99;162;255;218;0;8;1;1;0;1;63;0;255;0;37;55;169;166;140;111;207;26;123;88;12;53;226;208;131;122;190;45;125;184;108;195;100;81;201;21;203;226;64;56;92;199;99;215;122;176;127;73;194;95;108;207;255;0;189;24;56;138;227;110;151;64;149;176;255;0;88;194;178;48;213;88;31;97;215;239;90;171;181;182;144;30;126;169;67;122;35;107;98;167;57;64;186;138;122;102;127;23;58;98;124;215;119;151;80;146;44;67;130;12;77;112;174;156;147;45;84;173;237;99;130;73;235;243;146;89;99;58;164;140;190;194;70;32;191;93;224;211;145;88;228;14;230;222;31;28;83;231;74;212;209;103;130;57;0;225;186;113;73;155;45;51;242;22;70;120;124;31;171;245;24;138;88;102;64;241;200;174;188;84;235;247;116;142;145;161;121;28;42;142;178;78;128;98;191;54;81;193;170;83;3;59;241;234;92;86;223;238;117;154;135;156;162;122;9;186;58;122;122;170;154;103;15;4;207;27;113;83;166;40;51;141;92;68;45;92;98;101;239;97;186;216;183;221;237;245;203;172;19;239;250;7;99;125;212;72;3;83;139;158;104;164;165;229;71;78;4;210;255;0;248;92;87;92;235;107;159;149;60;164;142;229;27;20;123;187;26;179;43;6;82;65;29;68;108;35;22;204;215;87;74;68;117;90;205;31;31;182;49;69;112;164;175;132;53;52;161;134;155;195;168;131;227;247;61;117;194;150;134;35;44;242;105;192;119;159;96;197;215;48;213;215;146;138;76;80;122;0;237;62;222;207;79;83;61;52;171;44;18;178;56;234;35;22;140;209;13;73;88;107;52;142;94;160;253;74;223;114;222;111;240;91;212;198;186;60;231;169;59;151;219;138;186;186;138;201;140;211;200;93;143;232;7;1;218;172;153;150;106;34;144;84;147;37;63;234;201;136;103;138;120;86;72;156;58;48;212;17;247;21;251;48;173;32;106;122;98;12;253;237;214;19;14;239;35;179;187;22;98;117;36;237;39;182;89;175;117;54;185;118;18;208;177;223;79;245;24;164;171;167;171;129;38;133;249;72;195;227;192;253;193;152;111;194;145;77;53;59;107;57;27;91;208;24;36;146;73;58;146;123;117;158;241;61;178;163;148;164;152;152;239;167;17;138;122;136;42;160;142;104;95;148;142;59;117;250;242;150;232;57;17;237;157;198;224;224;61;35;135;118;119;103;118;44;204;117;36;245;147;211;83;208;214;84;144;32;167;146;79;98;156;69;149;175;82;105;255;0;14;23;95;73;128;193;202;55;145;246;35;39;128;124;79;97;187;66;9;106;55;35;138;239;126;216;101;101;36;48;32;142;227;176;244;214;27;211;219;167;228;72;73;167;115;190;61;31;196;48;142;174;138;234;65;82;53;4;118;203;133;116;52;52;178;79;33;216;163;96;239;102;238;24;171;171;154;178;162;73;230;109;89;207;232;56;14;150;221;107;171;184;73;201;129;55;71;214;115;177;70;45;217;98;223;74;3;76;188;252;156;91;171;220;48;170;170;0;80;0;29;64;121;149;118;250;26;184;185;53;20;232;231;143;120;247;226;237;148;166;129;76;212;68;202;157;233;246;198;56;142;7;165;202;151;174;109;133;4;239;186;223;193;110;4;247;118;178;64;198;97;186;154;250;178;168;223;65;17;33;60;79;30;150;201;101;146;229;47;41;181;88;16;239;183;31;1;136;41;225;166;137;98;134;48;145;175;80;29;6;99;203;43;94;178;85;81;129;21;82;251;150;79;3;129;84;81;218;41;208;163;169;209;129;238;56;4;17;168;58;244;96;149;32;131;161;7;102;50;245;212;92;104;199;47;78;126;61;21;199;30;7;181;102;171;145;164;164;20;209;157;37;156;109;226;169;210;219;232;165;174;171;138;158;62;182;59;79;1;199;20;180;208;210;193;28;16;174;136;131;65;209;103;155;0;120;205;210;157;55;147;65;56;28;59;155;17;205;36;103;117;177;21;106;54;199;221;63;12;2;8;212;116;86;123;139;91;171;163;155;236;29;217;7;21;56;70;87;69;117;32;171;0;65;237;15;34;70;142;238;116;85;4;147;192;12;92;235;94;186;182;105;219;168;157;20;112;81;212;58;92;163;66;33;164;122;182;27;242;157;23;193;71;71;36;105;44;111;27;168;100;117;33;135;16;113;119;160;107;117;202;170;148;245;35;238;248;169;218;15;246;69;60;145;29;211;179;134;34;172;141;246;54;233;232;178;141;199;158;166;122;73;27;126;17;170;120;175;104;205;149;252;197;18;211;33;223;152;237;252;163;165;85;44;193;71;89;32;98;150;33;5;44;16;40;208;70;129;122;79;148;58;64;181;148;117;96;127;17;10;31;106;121;145;84;75;23;81;217;192;226;42;184;223;97;221;62;61;5;166;185;168;43;224;168;7;98;182;141;226;167;175;10;193;130;176;58;130;53;29;159;48;215;124;246;235;81;32;58;162;30;66;123;23;165;182;32;123;141;26;158;249;147;247;233;126;80;162;83;105;165;113;214;149;31;184;243;162;169;150;46;163;168;224;113;21;92;82;108;215;146;120;31;63;43;214;252;234;214;136;199;87;132;242;15;179;187;179;93;234;126;101;109;169;155;93;240;154;47;181;182;14;154;212;193;46;84;76;127;156;159;191;75;159;216;45;158;157;117;218;245;3;224;15;65;21;84;177;247;234;56;28;69;83;20;155;53;208;240;62;110;80;172;230;46;70;18;119;103;77;61;227;179;103;42;146;176;83;83;15;182;197;207;176;116;209;185;142;68;113;214;172;15;233;136;101;89;161;138;64;117;14;129;135;188;116;159;40;149;35;157;161;164;4;106;161;164;110;138;42;185;99;216;119;135;3;136;170;34;147;168;232;120;31;237;165;157;169;234;97;152;117;198;225;191;67;133;101;116;87;7;80;192;17;217;115;84;252;229;222;68;238;137;85;58;124;169;112;231;237;134;156;145;203;128;233;254;19;209;146;20;18;78;128;98;255;0;113;254;241;187;84;212;3;185;175;37;63;42;244;145;86;72;155;27;120;98;41;227;151;234;157;188;63;178;193;80;42;44;244;172;78;213;78;79;188;108;236;183;9;140;245;213;82;147;175;42;86;63;30;158;205;114;107;117;116;115;117;161;221;144;113;92;71;36;114;70;146;70;193;149;128;32;142;139;58;95;5;29;25;161;133;190;158;113;189;197;19;166;4;131;136;171;100;77;143;188;62;56;201;21;145;207;110;169;140;29;76;114;235;167;14;80;236;149;14;34;164;168;144;157;57;49;177;30;225;130;117;58;246;12;185;152;13;11;138;106;134;60;193;59;15;161;133;101;101;12;172;8;35;80;71;65;127;204;20;182;138;114;73;15;59;15;163;139;253;78;42;234;167;172;168;150;162;119;47;36;135;82;123;7;201;204;225;43;43;226;61;240;171;126;135;178;94;95;145;106;174;111;254;45;241;217;216;173;25;130;174;221;164;103;233;32;215;234;30;239;102;40;47;20;23;5;81;12;192;55;160;219;8;243;101;150;40;80;188;178;42;32;235;102;58;12;94;179;197;60;33;161;183;125;44;157;242;159;168;61;156;113;83;83;61;84;207;52;242;52;146;57;212;179;109;39;176;228;25;57;55;221;9;208;60;14;59;38;97;58;89;107;127;40;31;169;236;96;144;65;7;66;49;79;152;47;52;192;8;235;9;3;168;56;229;140;12;247;117;131;248;212;48;184;226;9;24;111;148;106;158;71;36;91;163;247;185;197;70;124;189;202;165;98;16;194;15;162;186;159;142;43;46;53;213;207;202;170;169;146;83;248;142;207;112;236;121;37;180;204;84;190;40;255;0;183;100;204;202;127;185;106;244;234;0;126;227;179;75;69;27;237;93;211;137;96;146;35;188;54;113;236;153;43;254;227;163;246;63;237;217;47;170;94;205;93;179;170;61;123;4;48;77;59;242;34;141;157;184;40;215;20;185;78;233;48;13;40;72;65;244;142;167;244;24;135;38;82;70;7;63;83;35;158;240;55;113;22;92;178;198;63;229;121;71;241;49;56;91;109;185;52;228;81;66;63;192;49;243;106;101;26;8;35;30;197;24;104;105;244;211;153;79;233;24;150;138;133;193;83;73;9;7;138;3;137;114;229;134;96;121;118;216;118;250;35;147;138;156;141;97;148;107;23;61;17;252;45;175;239;138;191;147;170;144;91;230;117;169;39;131;141;49;95;151;175;22;253;77;69;27;242;125;53;222;95;212;118;12;140;160;230;8;137;26;133;138;67;217;46;16;153;109;213;171;167;92;47;251;116;212;212;181;21;82;136;160;137;157;207;112;197;183;40;68;160;73;91;39;44;255;0;45;118;15;121;196;20;244;244;201;200;134;21;141;71;114;142;146;233;149;108;247;16;204;97;17;75;252;200;247;113;122;202;87;59;94;178;5;231;224;244;208;109;31;152;116;223;39;209;147;117;169;147;208;167;63;19;217;25;67;35;41;239;4;98;84;49;203;34;30;181;98;63;67;210;89;236;117;23;39;229;29;99;128;29;231;227;224;49;71;65;75;67;8;138;158;48;163;188;247;147;196;244;228;3;140;195;146;224;171;15;83;111;65;20;253;102;47;178;255;0;236;113;44;50;193;43;197;42;20;116;58;50;157;132;30;147;228;234;45;22;227;63;18;136;59;45;250;14;98;239;88;160;104;11;150;30;198;219;209;216;172;175;113;155;151;38;162;157;14;241;227;224;49;20;81;195;26;199;26;133;69;26;0;59;22;104;203;48;221;96;51;66;21;106;208;110;158;231;28;14;36;142;72;164;120;228;82;174;132;134;83;214;8;232;242;60;28;197;133;31;77;233;165;103;247;13;222;203;156;233;130;86;83;206;163;100;145;233;239;94;138;221;65;45;125;92;116;241;247;157;227;192;119;156;83;83;69;75;4;112;196;188;148;65;160;236;153;231;47;137;35;55;58;100;222;77;147;1;222;190;151;68;1;36;0;54;147;139;117;48;164;183;81;211;1;252;40;149;79;183;191;178;230;154;94;126;212;238;6;173;11;7;247;117;30;139;43;219;190;107;69;207;184;250;73;246;251;19;178;186;171;171;35;40;42;192;130;15;81;24;204;22;163;107;186;79;79;161;230;201;229;70;120;169;232;114;197;9;174;189;209;69;166;170;31;150;254;196;219;217;165;137;37;138;72;156;2;174;164;31;97;197;85;59;211;84;205;3;141;232;220;169;247;116;22;202;67;89;95;79;7;115;54;247;176;109;56;85;10;161;64;208;1;160;29;155;63;219;121;235;124;53;138;187;208;54;135;242;63;67;242;125;64;85;42;171;200;218;223;69;25;253;251;62;113;161;230;170;227;171;69;209;38;26;31;104;232;50;100;0;213;212;84;17;175;54;129;71;181;187;61;198;149;42;173;213;116;231;111;57;19;46;8;32;144;122;193;211;207;142;55;150;68;141;6;172;236;0;30;39;22;170;21;183;219;169;105;87;255;0;26;13;124;88;237;39;179;222;40;18;186;130;104;0;222;211;84;63;136;97;149;149;138;176;208;131;161;30;126;76;80;148;19;190;155;90;111;216;118;139;172;66;27;157;116;99;169;103;113;241;243;242;61;171;231;87;19;87;34;235;21;55;197;207;105;205;150;179;75;89;243;148;31;71;57;219;167;115;249;249;54;80;104;42;99;215;106;203;175;234;59;69;206;81;53;202;182;81;212;243;185;31;175;157;28;111;44;137;26;41;102;102;1;64;239;39;22;59;98;90;237;176;83;15;173;167;42;86;226;231;180;215;209;195;91;69;53;60;131;235;245;55;3;199;21;52;242;211;79;36;18;174;142;141;161;30;118;83;174;90;107;143;50;231;68;156;5;247;142;207;127;185;45;182;211;85;62;186;57;94;68;126;44;222;126;69;178;243;147;27;156;233;185;25;34;16;123;219;188;246;188;211;102;249;204;38;178;4;214;72;134;248;31;105;124;229;98;172;24;29;8;58;131;139;5;238;42;248;21;36;96;42;16;104;227;210;252;67;178;203;44;80;196;242;202;225;35;81;171;49;216;6;51;61;252;221;234;244;143;81;77;22;162;49;199;139;31;58;201;105;154;237;95;29;52;123;23;174;71;244;87;20;212;240;210;193;28;17;47;38;56;212;42;142;217;153;172;159;50;156;212;192;159;65;33;234;244;27;206;142;73;34;117;120;220;171;41;212;17;179;20;57;202;84;64;149;177;25;63;26;245;226;44;213;98;114;3;86;8;143;7;82;49;229;86;93;245;156;56;242;171;46;250;206;28;121;85;151;125;103;14;60;170;203;190;179;135;30;85;101;223;89;195;143;42;178;239;172;225;199;149;89;119;214;112;227;202;172;187;235;56;113;229;86;93;245;156;56;242;171;46;250;206;28;121;85;151;125;103;14;60;170;203;190;179;135;30;85;101;223;89;195;143;42;178;239;172;225;199;149;89;119;214;112;227;202;172;187;235;56;112;249;155;47;40;255;0;169;71;138;220;245;103;129;72;167;18;84;63;128;228;175;234;113;121;204;87;27;177;210;103;9;8;234;137;54;15;127;157;79;4;213;51;199;4;40;94;71;96;170;163;188;156;88;44;113;89;232;132;123;26;103;208;202;252;79;1;224;59;108;208;197;60;79;20;138;25;28;104;65;197;238;205;53;178;163;77;166;23;254;27;249;238;136;227;70;26;226;90;30;248;207;184;225;149;148;232;192;131;217;149;89;152;42;130;88;157;0;27;73;56;202;153;109;109;176;138;170;149;6;170;65;213;252;177;219;234;233;32;171;167;120;38;64;200;113;120;179;212;91;39;228;176;45;19;29;201;56;244;15;26;56;209;148;28;75;66;70;216;206;190;7;12;165;78;140;52;61;141;85;157;130;168;37;137;208;1;180;147;140;171;149;69;8;74;202;212;214;160;141;81;59;163;251;134;162;158;26;168;30;25;144;58;55;88;56;189;88;39;183;57;116;214;74;114;118;63;163;224;221;12;145;36;131;70;93;113;45;19;141;177;157;71;12;16;65;208;130;59;4;20;243;212;204;144;193;27;60;142;116;85;93;164;227;45;229;72;173;160;84;213;1;37;87;194;63;184;221;17;212;163;168;101;35;66;14;209;139;214;85;100;229;207;64;57;75;223;23;120;252;184;32;169;32;130;8;238;232;100;134;57;6;242;251;241;45;19;174;212;222;31;28;105;161;208;244;182;155;45;117;214;110;69;60;123;160;239;200;118;42;226;201;151;232;173;17;125;26;242;230;35;126;86;235;63;115;93;108;20;119;16;207;167;55;55;243;20;124;15;28;92;172;213;214;231;210;120;247;59;164;93;170;122;41;96;142;81;188;54;241;196;180;114;38;213;222;29;20;113;201;43;170;70;133;217;142;129;64;212;156;89;114;44;178;114;39;185;147;26;117;136;65;222;63;155;20;212;208;82;194;177;65;18;198;138;54;42;143;186;29;17;212;171;168;96;122;193;218;49;113;202;52;211;3;45;35;115;47;232;157;170;113;93;105;175;160;98;42;32;96;61;49;181;79;191;162;150;158;41;122;198;222;35;18;210;72;155;70;240;243;163;142;73;28;36;104;89;143;80;3;83;139;86;71;184;213;114;94;172;252;218;62;7;107;156;91;44;118;219;90;1;77;0;15;223;35;109;99;247;99;40;96;85;128;32;245;131;183;21;217;90;215;82;11;162;24;27;138;127;182;43;50;141;202;29;76;5;39;95;13;135;19;210;84;211;177;89;224;120;207;226;4;116;50;211;69;47;88;208;241;24;150;146;88;246;233;202;28;70;0;44;116;3;83;138;28;179;123;174;208;197;68;234;190;155;238;15;142;40;126;79;81;52;106;250;190;81;254;92;88;161;180;219;168;23;147;73;74;145;241;109;53;99;237;39;239;23;69;113;201;101;4;112;35;92;84;88;109;21;4;150;164;85;241;93;211;240;196;249;50;222;195;88;106;101;79;3;163;98;92;149;82;54;199;89;25;240;96;65;195;228;251;186;245;115;68;126;109;63;124;54;84;189;6;211;152;82;124;28;99;201;107;222;186;124;216;127;80;192;202;87;147;215;28;107;237;124;67;146;174;111;245;166;133;7;188;226;12;144;9;2;90;195;227;201;92;69;148;237;16;232;88;60;199;241;54;207;134;41;237;212;20;191;192;164;138;51;196;40;7;252;164;127;255;217;}; content_type="image/*"; content_encoding="identity";}'

dfx canister call IcpAccelerator_backend set_asset_canister '(principal "'$ASSET_CANISTER'")'