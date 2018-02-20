<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
    <link rel="stylesheet" href="<?php echo base_url('assets/css/style.css'); ?>">
    <title>SellingHive</title>
</head>
    <body data-url="<?php echo base_url(); ?>">
        <div class="backWrap"></div>
        <header id="page-header" style="z-index: 99;">
            <div class="logo-block">
                <h1><img src="<?php echo base_url('assets/images/logo.png'); ?>"></h1>
            </div>
            <form class="searchForm">
                <input type="text" class="searchBar" placeholder="Search">
                <i class="fa fa-search" aria-hidden="true"></i>
            </form>
            <h1 class="page-title">Reset Password</h1>
            <div class="branch"><a href="#dashboard_corporate.html"></a></div>
        </header>
        <div id="wrap">
            <div id="sh_content">
                <form method="POST" id="sigin">
                    <div class="formGroup">
                        <label for="password01">New Password</label>
                        <input class="input password01" id="password01" type="password">
                    </div>
                    <div class="formGroup mt15 mb15">
                        <label for="password02">Confirm Password</label>
                        <input class="input password02" id="password02" type="password">
                    </div>

                    <button type="submit" class="default-btn btn reset-btn button noIcon" id="confirm" disabled="disabled">Reset</button>
                </form>
            </div>
        </div>
        <script src="<?php echo base_url('assets/js/jquery-3.0.0.min.js'); ?>"></script>
        <script src="<?php echo base_url('assets/js/jquery.toast.js'); ?>"></script>
        <script src="<?php echo base_url('assets/js/reset-password.js'); ?>"></script>
    </body>
</html>